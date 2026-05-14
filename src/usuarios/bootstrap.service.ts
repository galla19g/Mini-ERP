import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Role } from './enums/rol.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService implements OnModuleInit {
  constructor(private usuariosService: UsuariosService) {}

  async onModuleInit() {
    const rolesToCreate = [
      { email: 'admin@sigemp.com', password: 'password123', rol: Role.ADMIN },
      { email: 'vendedor@sigemp.com', password: 'password123', rol: Role.VENDEDOR },
      { email: 'productos@sigemp.com', password: 'password123', rol: Role.PRODUCTOS },
      { email: 'contador@sigemp.com', password: 'password123', rol: Role.CONTADOR },
      { email: 'proveedor@sigemp.com', password: 'password123', rol: Role.PROVEEDOR },
      { email: 'cliente@sigemp.com', password: 'password123', rol: Role.CLIENTE },
    ];

    for (const userData of rolesToCreate) {
      const existingUser = await this.usuariosService.findOneByEmail(userData.email);
      if (!existingUser) {
        console.log(`Creando usuario ${userData.rol.toLowerCase()} por defecto...`);
        await this.usuariosService.create({
          email: userData.email,
          password: userData.password,
          rol: userData.rol,
        });
        console.log(`Usuario ${userData.rol.toLowerCase()} creado con éxito.`);
      }
    }
  }
}
