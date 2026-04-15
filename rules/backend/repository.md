# Repository

- Extend `BaseRepository<IEntity>` from `@repo/backend/lib/repositories/BaseRepository.sequelize`
- Constructor: `super(EntityModel as any)`
- Must implement `getSearchQuery = (searchText: string): WhereOptions<IEntity> => ({...})`
- Export a singleton: `export default new EntityRepository()`
- All DB access lives here — never in services or controllers
- Use inherited methods: `getAll`, `getById`, `findOne`, `create`, `update`, `delete`, `bulkCreate`, `bulkUpdate`, `bulkDelete`, `getAllWithCursor`
- Add custom query methods only when inherited methods are insufficient
