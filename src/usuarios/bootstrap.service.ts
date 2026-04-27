import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Role } from './enums/rol.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService implements OnModuleInit {
  constructor(private usuariosService: UsuariosService) {}

  async onModuleInit() {
    const adminEmail = 'admin@sigemp.com';
    const existingAdmin = await this.usuariosService.findOneByEmail(adminEmail);

    if (!existingAdmin) {
      console.log('Creando usuario administrador por defecto...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.usuariosService.create({
        email: adminEmail,
        password: hashedPassword,
        rol: Role.ADMIN,
      });
      console.log('Usuario administrador creado con éxito.');
    }
  }
}
