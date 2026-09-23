# Capturas reales de la app Android de GymMachine

Así se generaron las 28 pantallas de `demos/gymmachine/pantallas/` (23-sep-2026), **sin tocar la base de Firebase real**.

1. **Copia de la app** (no el repo): se copió `GymMachine/AndroidStudio` y en `c_GymApp.onCreate()` se agregó
   ```kotlin
   FirebaseAuth.getInstance().useEmulator("10.0.2.2", 9099)
   FirebaseFirestore.getInstance().useEmulator("10.0.2.2", 8080)
   ```
   más `android:usesCleartextTraffic="true"` en el manifest. `./gradlew assembleDebug` con JDK 21.
2. **Firebase Local Emulator** (esta carpeta tiene el `firebase.json`):
   `firebase emulators:start --only auth,firestore --project gymmachine-54965`
3. **Datos de demostración**: `node seed.mjs` (borra y resiembra el emulador: gimnasio, 4 planes, dueño, 3 entrenadores,
   12 miembros, 12 meses de pagos, rutinas, dieta, sesiones, asistencia y mediciones). Cuentas, solo en el emulador:
   `dueno@ / entrenador@ / miembro@gymmachine.demo`, contraseña `demo1234`.
4. **Emulador Android** (`Resizable_Experimental`), instalar el APK, `pm clear` para borrar sesiones viejas y navegar con
   los ayudantes de `h.sh` (`entra`, `tapq`, `cap`, `textos`, `desliza`, `atras`).
5. Recortar: `sips -Z 1200 -s format jpeg -s formatOptions 78` → `demos/gymmachine/pantallas/`.

Notas: la barra inferior del miembro dice PROFILE/ROUTINE/… porque así está escrita en la app. La pantalla de NFC se
omitió porque el emulador no tiene NFC y muestra un aviso de error.
