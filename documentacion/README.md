# Documentación — Refugio del Sol

Muestra **visual y estructural** de la memoria del Proyecto Final de 2º DAW.
Incluye portada, índice y la sección _"Finalidad del proyecto"_ ya maquetada
para validar la estética antes de redactar la documentación completa.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `muestra-visual.html` | Vista visual fiel del documento. Se abre en cualquier navegador y es la referencia estética principal. |
| `muestra-visual.docx` | Versión editable en Word/LibreOffice/Google Docs. Reproduce la maqueta con las limitaciones propias de Word. |
| `generar_docx.py` | Script que regenera el `.docx` desde cero (útil cuando se cambien colores, textos o estructura). |
| `assets/logo.png` | Logo de la asociación usado en portada y header. |

## Cómo ver / exportar la muestra visual a PDF

1. Doble clic sobre `muestra-visual.html` (se abre en Chrome o Edge).
2. `Ctrl + P` → **Destino: Guardar como PDF**.
3. Configuración recomendada:
   - **Tamaño de papel:** A4
   - **Márgenes:** Predeterminados (el HTML ya define los suyos)
   - **Gráficos de fondo:** ✅ activado (importante: sin esto desaparecen las bandas de color de la portada y el callout)
   - **Encabezados y pies de página del navegador:** ❌ desactivado
4. Guardar como `muestra-visual.pdf`.

> 💡 La portada se imprime sin encabezado ni pie de página; el resto de
> páginas llevan línea fina mostaza arriba y línea sage abajo, con el
> número de página `— N —` en la esquina inferior derecha.

## Cómo editar el .docx

Abrir `muestra-visual.docx` con Word (preferible) o LibreOffice. Para que la
tipografía se vea correctamente conviene tener instalada la fuente
**Poppins** (gratuita en Google Fonts). Si no está instalada, Word usará un
sustituto cercano (Calibri) sin perder la estructura.

Los textos del cuerpo se pueden sustituir directamente sobre el documento.
Las plantillas de color y estilos están aplicadas, así que basta con
respetar los estilos al pegar texto nuevo (`Inicio → Pegar como texto sin
formato`).

## Cómo regenerar el .docx desde cero

Útil si cambian colores, márgenes o quieres rehacer la maqueta tras una
edición fallida.

```powershell
# Solo la primera vez:
pip install python-docx

# Cada vez que se quiera regenerar:
python generar_docx.py
```

El script reescribe `muestra-visual.docx` desde `generar_docx.py`. Toda la
paleta y la tipografía están definidas como constantes al principio del
archivo, fácilmente modificables.

## Identidad visual

Paleta heredada de la web del proyecto
(`plataforma-felina-frontend/src/styles.css`):

| Color | Hex | Uso |
|---|---|---|
| Mostaza primario | `#E9C46A` | Líneas, acentos, bullets |
| Mostaza oscuro | `#D4A943` | Subtítulos H2 |
| Sage secundario | `#80AB9F` | Separadores, pie de página |
| Sage oscuro | `#6C9286` | H3, eyebrows |
| Berenjena | `#4F3D63` | Títulos, texto principal |
| Crema | `#F2E9E4` | Fondo de callouts |
| Texto cuerpo | `#2D1F3D` | Párrafos |

Tipografía: **Poppins** (300/400/500/600/700) + cursiva con _Cormorant
Garamond_ para el eslogan en la portada.

## Estado del documento

Esta muestra contiene **solo 3 páginas** a modo de prototipo visual:

1. **Portada** — título técnico, marca "Refugio del Sol", eslogan, autora, curso, centro.
2. **Índice** — estructura completa de las 11 secciones del proyecto con sus 10 subsecciones del apartado 6.
3. **Sección 04 — Finalidad del proyecto** — primera sección de contenido ya redactada y maquetada como referencia.

El resto de secciones del índice todavía no se han redactado: aparecerán
cuando se complete la documentación.
