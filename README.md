# Dedicatorias térmicas

Editor de mensajes enriquecidos para dedicatorias que se imprimen en impresoras térmicas de 58 mm u 80 mm.

## Ejecutar en VS Code

No requiere base de datos ni instalación de dependencias.

1. Abrí esta carpeta en Visual Studio Code.
2. Ejecutá `npm start` en la terminal.
3. Abrí la URL local que mostrará `serve`.

También podés abrir `index.html` directamente en el navegador, aunque un servidor local ofrece una experiencia más consistente.

## Funciones

- Editor Rich Text con formato por selección.
- Plantillas editables para ocasiones frecuentes.
- Inserción de emojis, fecha, separador y firma.
- Papel configurable de 58 mm u 80 mm.
- Vista previa e impresión con `@media print`.
- Guardado automático en `localStorage`.

## Emojis e impresión térmica

Los emojis se conservan en el editor y se muestran como advertencia porque muchas impresoras térmicas ESC/POS no tienen glifos gráficos. Para máxima compatibilidad, reemplazalos por caracteres de texto como `*`, `+` o `♥` antes de imprimir, según la tabla de caracteres de tu impresora.
