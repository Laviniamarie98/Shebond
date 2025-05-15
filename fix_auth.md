# Solucionar Problemas de Inicio de Sesión

Si estás teniendo problemas para iniciar sesión en la aplicación, sigue estos pasos para solucionarlos:

## 1. Verificar la configuración de Supabase

Asegúrate de que tienes correctamente configuradas las credenciales de Supabase en el archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 2. Ejecutar la migración de arreglo de perfiles

Hemos incluido un script de migración que soluciona problemas comunes con la tabla de perfiles. Para ejecutarlo:

1. Ve al panel de administración de Supabase
2. Navega a "SQL Editor"
3. Copia y pega el contenido del archivo `supabase/migrations/20240601000000_profile_fix.sql`
4. Ejecuta el script

Este script hará lo siguiente:
- Creará la tabla `profiles` si no existe
- Asegurará que la columna `full_name` exista
- Migrará datos de la tabla `users` a `profiles` si es necesario
- Configurará correctamente la columna `due_date` y triggers asociados

## 3. Verificar el inicio de sesión

Una vez ejecutada la migración, intenta iniciar sesión nuevamente. Si todavía tienes problemas, prueba lo siguiente:

1. Borra las cookies y el almacenamiento local del navegador
2. Intenta iniciar sesión con credenciales correctas
3. Si olvidaste tu contraseña, usa la opción de "Recuperar contraseña"

## 4. Crear una cuenta nueva

Si los pasos anteriores no funcionaron, puedes crear una nueva cuenta:

1. Haz clic en "Sign Up" en la pantalla de inicio de sesión
2. Completa el formulario con tu correo electrónico y una contraseña
3. Sigue las instrucciones para verificar tu cuenta
4. Completa tu perfil con tu nombre y fecha de inicio del embarazo

## Problemas conocidos y soluciones

### Error: "No se pudo encontrar el perfil de usuario"

Este error generalmente se produce por un desajuste entre las tablas `auth.users` y `profiles`. La migración anterior debería resolverlo.

### Error: "La contraseña no es válida"

Asegúrate de estar utilizando la contraseña correcta. Si no la recuerdas, usa la opción de "Recuperar contraseña".

### Error: "El usuario no existe"

Asegúrate de estar utilizando el correo electrónico con el que te registraste. Si estás seguro de que es correcto, es posible que necesites crear una nueva cuenta.

## Contacto de soporte

Si después de seguir estos pasos sigues experimentando problemas, por favor contacta a nuestro equipo de soporte en [support@shebond.com](mailto:support@shebond.com). 