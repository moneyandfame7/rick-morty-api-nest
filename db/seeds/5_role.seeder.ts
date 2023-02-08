import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Role } from '../../src/roles/entities/role.entity'

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    try {
      const roleRepository = dataSource.getRepository(Role)

      const roles: Role[] = [
        { id: 1, value: 'admin' },
        { id: 2, value: 'user' }
      ]
      await roleRepository.insert(roles)
      console.log('✅ Roles filling successfully. ')
    } catch (error) {
      console.log('❌ Roles filling failed ')
    }
  }
}