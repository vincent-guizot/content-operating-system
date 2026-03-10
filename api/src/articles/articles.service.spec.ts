import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { PrismaService } from '../../prisma/prisma.service'

// Helper to build a fresh prisma mock per test
const createPrismaMock = () => {
  const prisma = {
    article: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    brand: {
      findUnique: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    tag: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    articleTag: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  }

  // Default $transaction delegates to run the callback with the same prisma mock as `tx`
  ;(prisma as any).$transaction.mockImplementation(async (cb: any) => cb(prisma))

  return prisma as unknown as jest.Mocked<PrismaService>
}

describe('ArticlesService', () => {
  let service: ArticlesService
  let prisma: jest.Mocked<PrismaService>

  beforeEach(async () => {
    prisma = createPrismaMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile()

    service = module.get<ArticlesService>(ArticlesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // Behavior 1: Should validate required fields and throw BadRequestException when missing
  it('create() should throw BadRequestException when required fields are missing', async () => {
    const payload: any = {
      title: '',
      slug: ' ',
      brandId: null,
      categoryId: undefined,
      content: ' ',
      status: undefined,
      visibility: undefined,
    }

    await expect(service.create(payload as any)).rejects.toBeInstanceOf(BadRequestException)

    // Ensure no write queries were attempted when validation fails
    expect(prisma.article.create).not.toHaveBeenCalled()
  })

  // Behavior 2: Should fail when category does not belong to the provided brand
  it('create() should throw BadRequestException if category does not belong to brand', async () => {
    const payload: any = {
      title: 'Title',
      slug: 'unique-slug',
      brandId: 1,
      categoryId: 99,
      content: 'Hello',
      status: 'draft',
      visibility: 'public',
    }

    // slug not exists
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce(null as any)
    // brand exists
    ;(prisma.brand.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'B1' } as any)
    // category exists, but belongs to a different brand
    ;(prisma.category.findUnique as jest.Mock).mockResolvedValueOnce({ id: 99, brandId: 2, name: 'C' } as any)

    await expect(service.create(payload)).rejects.toBeInstanceOf(BadRequestException)

    expect(prisma.article.create).not.toHaveBeenCalled()
  })

  // Behavior 3: Should create article and handle tags (mix of existing and new tags)
  it('create() should persist article and attach tags creating new ones when needed', async () => {
    const payload: any = {
      title: 'Title',
      slug: 'unique-slug',
      brandId: 1,
      categoryId: 10,
      content: 'Body',
      status: 'draft',
      visibility: 'public',
      tagIds: [5],
      tags: ['NewTag', 'existingtag', '  '], // includes whitespace-only tag to be ignored
      optionalField: '', // should be cleaned out
    }

    // Validation stubs
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce(null as any) // slug check
    ;(prisma.brand.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 } as any)
    ;(prisma.category.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10, brandId: 1 } as any)

    // Transaction steps
    ;(prisma.article.create as jest.Mock).mockResolvedValueOnce({ id: 123, brandId: 1 } as any)

    // handleTags: existingtag found, NewTag not found -> created
    ;(prisma.tag.findFirst as jest.Mock)
      .mockResolvedValueOnce(null as any) // for 'newtag'
      .mockResolvedValueOnce({ id: 7, name: 'existingtag', brandId: 1 } as any)

    ;(prisma.tag.create as jest.Mock).mockResolvedValueOnce({ id: 6, name: 'newtag', brandId: 1 } as any)

    // final read with includes
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 123,
      brandId: 1,
      brand: { id: 1, name: 'B1' },
      category: { id: 10, name: 'C1' },
      tags: [
        { tag: { id: 5, name: 'preexisting' } },
        { tag: { id: 6, name: 'newtag' } },
        { tag: { id: 7, name: 'existingtag' } },
      ],
    } as any)

    const result = await service.create(payload)

    // Ensure create received cleaned data (optionalField removed)
    expect(prisma.article.create).toHaveBeenCalledWith({
      data: {
        title: 'Title',
        slug: 'unique-slug',
        brandId: 1,
        categoryId: 10,
        content: 'Body',
        status: 'draft',
        visibility: 'public',
      },
    })

    // Ensure createMany joined ids: [5, 6, 7]
    expect(prisma.articleTag.createMany).toHaveBeenCalledWith({
      data: [5, 6, 7].map((tagId) => ({ articleId: 123, tagId })),
    })

    expect(result.id).toBe(123)
    expect(result.tags).toHaveLength(3)
  })

  // Behavior 4: findOneBySlug should map tags to tag list and throw on missing article
  it('findOneBySlug() should throw NotFoundException when article not found', async () => {
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce(null as any)
    await expect(service.findOneBySlug('missing')).rejects.toBeInstanceOf(NotFoundException)
  })

  it('findOneBySlug() should return article with tags flattened to tag objects', async () => {
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      slug: 's',
      brand: {},
      category: {},
      tags: [
        { tag: { id: 1, name: 'a' } },
        { tag: { id: 2, name: 'b' } },
      ],
    } as any)

    const res = await service.findOneBySlug('s')
    expect(res.tags).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ])
  })

  // Behavior 5: update should prevent duplicate slug and re-attach tags
  it('update() should throw BadRequestException if slug duplicates another article', async () => {
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10 } as any) // existing target

    // cleanData has slug -> check duplicate
    ;(prisma.article.findFirst as jest.Mock).mockResolvedValueOnce({ id: 11 } as any)

    await expect(service.update(10, { slug: 'dup' } as any)).rejects.toBeInstanceOf(BadRequestException)

    expect(prisma.article.update).not.toHaveBeenCalled()
  })

  it('update() should update data, clear and reattach tags', async () => {
    // existing target
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce({ id: 10, brandId: 2 } as any)

    // duplicate slug check -> none
    ;(prisma.article.findFirst as jest.Mock).mockResolvedValueOnce(null as any)

    // update
    ;(prisma.article.update as jest.Mock).mockResolvedValueOnce({ id: 10, brandId: 2 } as any)

    // deleteMany previous tags
    ;(prisma.articleTag.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 2 } as any)

    // handleTags: no additional string tags, only ids
    ;(prisma.articleTag.createMany as jest.Mock).mockResolvedValueOnce({ count: 2 } as any)

    // final fetch with includes
    ;(prisma.article.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 10,
      brand: {},
      category: {},
      tags: [{ tag: { id: 3 } }],
    } as any)

    const res = await service.update(10, { title: 'New', tagIds: [3], tags: [] } as any)

    expect(prisma.article.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { title: 'New' } })
    expect(prisma.articleTag.deleteMany).toHaveBeenCalledWith({ where: { articleId: 10 } })
    expect(prisma.articleTag.createMany).toHaveBeenCalledWith({ data: [{ articleId: 10, tagId: 3 }] })
    expect(res.tags).toHaveLength(1)
  })
})
