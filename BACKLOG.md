# Backlog de Mejoras y Correcciones (PRs Roadmap)

> Lista estructurada de mejoras, correcciones y refactorizaciones identificadas para **Cuentas Claras**, organizada para ser abordada en Pull Requests (PRs) independientes.

---

## Índice de PRs

| PR # | Tipo | Título | Prioridad |
| :--- | :--- | :--- | :--- |
| [PR-02](#pr-02-generación-robusta-de-ids-con-cryptorandomuuid) | 🐛 Bug | Generación robusta de IDs con `crypto.randomUUID()` | **Alta** |
| [PR-03](#pr-03-ordenamiento-descendente-en-algoritmo-de-reparto-voraz) | 🧮 Refactor | Ordenamiento descendente en algoritmo de reparto voraz | **Media** |
| [PR-04](#pr-04-soporte-para-montos-con-decimales-centavos) | 💡 UX | Soporte para montos con decimales (centavos) | **Media** |
| [PR-05](#pr-05-copiar-resumen-de-reparto-al-portapapeles-para-whatsapp) | 🚀 Feature | Copiar resumen de reparto al portapapeles para WhatsApp | **Media** |
| [PR-06](#pr-06-acción-de-reiniciar--nuevo-grupo-con-modal-de-confirmación) | 🚀 Feature | Acción de reiniciar / nuevo grupo con modal de confirmación | **Media** |
| [PR-07](#pr-07-insignias-de-balance-neto-individual-por-participante) | 🚀 Feature | Insignias de balance neto individual por participante | **Media** |
| [PR-08](#pr-08-feedback-de-validación-y-confirmación-de-eliminación) | 💡 UX | Feedback de validación y confirmación de eliminación | **Media** |
| [PR-09](#pr-09-unificación-de-formateo-de-moneda-y-memoización-de-intlnumberformat) | ⚡ Perf | Unificación de formateo de moneda y memoización de `Intl.NumberFormat` | **Baja** |
| [PR-10](#pr-10-accesibilidad-web-atributo-lang-y-aria-labels) | ♿ A11y | Accesibilidad Web: atributo `lang="es"` y `aria-label`s en botones | **Baja** |
| [PR-11](#pr-11-eliminación-de-hoja-de-estilos-bootstrap-redundante-en-indexhtml) | ⚡ Perf | Eliminación de hoja de estilos Bootstrap redundante en `index.html` | **Baja** |
| [PR-12](#pr-12-pasos-de-test-y-lint-en-github-actions-y-actualización-a-v4) | 🛠️ CI/CD | Pasos de test y lint en GitHub Actions y actualización a v4 | **Baja** |
| [PR-13](#pr-13-clarificación-de-naming-de-pagos-y-reparto-en-ui-y-código) | 💡 UX / Refactor | Clarificación de naming de Pagos y Reparto en UI y Código | **Media** |

---

## Detalle de Pull Requests

### PR-02: Generación robusta de IDs con `crypto.randomUUID()`
- **Tipo**: Corrección de Bug / Confiabilidad
- **Prioridad**: Alta
- **Archivos afectados**:
  - `src/components/ExpenseAddForm.vue`
  - `src/components/PaymentAddForm.vue`
- **Problema**:
  - El uso de `Date.now().toString()` genera colisiones de ID si dos operaciones ocurren dentro del mismo milisegundo (ej. cargas rápidas, scripts o futuras importaciones de datos).
- **Solución propuesta**:
  - Reemplazar `id: Date.now().toString()` por `id: crypto.randomUUID()`.
- **Criterio de aceptación**:
  - Todos los nuevos gastos y pagos se crean con un identificador UUID estándar v4.

---

### PR-03: Ordenamiento descendente en algoritmo de reparto voraz
- **Tipo**: Optimización algorítmica / Refactor
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/calculator.ts`
  - `src/calculator.test.ts`
- **Problema**:
  - En `calculateBalance`, las listas `debtors` y `creditors` se procesan según el orden arbitrario de iteración de `Object.entries(balanceMap)`. Sin ordenamiento por magnitud, el algoritmo voraz (greedy) puede generar más transferencias de las estrictamente necesarias.
- **Solución propuesta**:
  - Ordenar ambos arreglos en forma descendente por monto antes de iniciar el bucle de liquidación:
    ```typescript
    debtors.sort((a, b) => b[1] - a[1])
    creditors.sort((a, b) => b[1] - a[1])
    ```
  - Agregar pruebas unitarias en `src/calculator.test.ts` verificando que el orden de registro de los participantes no altere la cantidad mínima de transferencias resultante.
- **Criterio de aceptación**:
  - Se garantiza un número mínimo óptimo de transferencias sin importar el orden de inserción de los datos.
  - Todos los tests existentes en `calculator.test.ts` continúan pasando.

---

### PR-04: Soporte para montos con decimales (centavos)
- **Tipo**: Mejora de UX / Usabilidad
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/components/ExpenseAddForm.vue`
  - `src/components/ExpenseEditForm.vue`
  - `src/components/PaymentAddForm.vue`
  - `src/components/PaymentListItem.vue`
- **Problema**:
  - Los campos de entrada numérica tienen `step="1"`, lo que restringe o genera advertencias de validación al intentar ingresar montos con centavos (ej. `$1520.50`).
- **Solución propuesta**:
  - Configurar `step="0.01"` en los inputs numéricos de monto.
- **Criterio de aceptación**:
  - Los usuarios pueden ingresar y editar importes con decimales de manera fluida.

---

### PR-05: Copiar resumen de reparto al portapapeles para WhatsApp
- **Tipo**: Nueva Característica (Feature)
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/components/TransfersSection.vue`
- **Problema**:
  - Luego de cargar los gastos grupales, los usuarios necesitan compartir el resultado en chats grupales (WhatsApp, Telegram) y deben transcribirlo manualmente.
- **Solución propuesta**:
  - Incorporar un botón en la cabecera de `TransfersSection` ("Copiar resumen" con ícono `bi-copy` / `bi-whatsapp`).
  - Formatear el texto de las transferencias:
    ```text
    *Cuentas Claras - Reparto final:*
    • Juan le debe a Carlos: $ 1.500,00
    • María le debe a Carlos: $ 750,00
    ```
  - Copiar mediante `navigator.clipboard.writeText()` y mostrar feedback visual temporal ("Copiado").
- **Criterio de aceptación**:
  - El botón copia el balance formateado y muestra feedback temporal al usuario.

---

### PR-06: Acción de reiniciar / nuevo grupo con modal de confirmación
- **Tipo**: Nueva Característica (Feature)
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/stores/expenses.ts`
  - `src/components/AppHeader.vue` o `src/components/AppFooter.vue`
- **Problema**:
  - No existe forma dentro de la UI para vaciar los datos guardados en `localStorage` y comenzar un nuevo viaje o grupo sin abrir las herramientas de desarrollo del navegador.
- **Solución propuesta**:
  - Agregar una acción `resetState()` en el store que limpie `members`, `expenses`, `payments` y actualice `localStorage`.
  - Agregar un botón discreto "Reiniciar grupo" / "Nuevo grupo" con modal de confirmación de Bootstrap para evitar pérdidas accidentales.
- **Criterio de aceptación**:
  - El usuario puede resetear todo el estado de la aplicación previa confirmación explícita.

---

### PR-07: Insignias de balance neto individual por participante
- **Tipo**: Nueva Característica (Feature) / UX
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/stores/expenses.ts`
  - `src/components/MemberListItem.vue`
- **Problema**:
  - En la sección de participantes, sólo se ven los nombres. No se puede ver a simple vista quién está en saldo positivo (acreedor) o negativo (deudor) y por cuánto dinero global.
- **Solución propuesta**:
  - Crear un getter en el store `memberBalances: Record<string, number>` que devuelva el balance neto por persona.
  - Mostrar en `MemberListItem` una insignia con el balance:
    - Verde (`badge text-bg-success`): `+ $ 2.500` (acreedor)
    - Rojo (`badge text-bg-danger`): `- $ 1.200` (deudor)
    - Gris (`badge text-bg-secondary`): `$ 0` (equilibrado)
- **Criterio de aceptación**:
  - Cada participante muestra su balance acumulado actualizado en tiempo real.

---

### PR-08: Feedback de validación y confirmación de eliminación
- **Tipo**: Mejora de UX / Seguridad
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/components/MemberAddForm.vue`
  - `src/components/PaymentAddForm.vue`
  - `src/components/MemberListItem.vue`
  - `src/components/ExpenseListItem.vue`
  - `src/components/PaymentListItem.vue`
- **Problema**:
  - Al ingresar un miembro duplicado o vacío, `store.addMember` retorna `false` pero el formulario no muestra ningún mensaje de error al usuario.
  - En `PaymentAddForm`, los selects `from` y `to` permiten seleccionar a la misma persona para pagarse a sí misma.
  - Los botones de eliminación borran elementos de forma inmediata sin confirmación previa.
- **Solución propuesta**:
  - Agregar feedback visual en los formularios (ej. clase `is-invalid` y mensaje de error).
  - Deshabilitar en el select de destino (`to`) la opción seleccionada en el origen (`from`).
  - Agregar un diálogo o paso de confirmación rápido antes de eliminar miembros, gastos o pagos.
- **Criterio de aceptación**:
  - Los formularios informan claramente el motivo de fallo y se previene la selección de auto-pagos.
  - Se previene la eliminación accidental de registros.

---

### PR-09: Unificación de formateo de moneda y memoización de `Intl.NumberFormat`
- **Tipo**: Rendimiento y Consistencia de Código
- **Prioridad**: Baja
- **Archivos afectados**:
  - `src/numberFormatter.ts`
  - `src/components/PaymentListItem.vue`
  - `src/components/TransfersSection.vue`
- **Problema**:
  - `PaymentListItem` y `TransfersSection` usan `.toFixed(2)` (con punto decimal anglosajón), mientras que `ExpenseListItem` utiliza `useNumberFormat` (con coma decimal argentina).
  - En `src/numberFormatter.ts`, `new Intl.NumberFormat` se instancia en cada ejecución de la función `format`, lo cual es computacionalmente costoso en renderizados frecuentes de listas.
- **Solución propuesta**:
  - Memoizar la instancia de `Intl.NumberFormat` en `src/numberFormatter.ts`.
  - Reemplazar todas las apariciones de `.toFixed(2)` por el helper centralizado `useNumberFormat()`.
- **Criterio de aceptación**:
  - Todos los montos en la aplicación se formatean homogéneamente bajo el estándar `es-AR` sin recrear el formateador en cada llamada.

---

### PR-10: Accesibilidad Web: atributo `lang="es"` y `aria-label`s en botones
- **Tipo**: Accesibilidad (A11y)
- **Prioridad**: Baja
- **Archivos afectados**:
  - `index.html`
  - `src/components/ExpenseAddForm.vue`
  - `src/components/ExpenseEditForm.vue`
  - `src/components/PaymentAddForm.vue`
  - `src/components/MemberAddForm.vue`
- **Problema**:
  - `index.html` tiene `<html lang="en">`, lo que provoca que los lectores de pantalla utilicen pronunciación en inglés para una interfaz íntegramente en español.
  - Varios botones con solo íconos (ej. guardar `bi-check-lg`, cancelar `bi-x-lg`) carecen de `aria-label`.
- **Solución propuesta**:
  - Cambiar a `<html lang="es">`.
  - Añadir `aria-label="Guardar"`, `aria-label="Cancelar"`, etc. en todos los botones de ícono único.
- **Criterio de aceptación**:
  - Los lectores de pantalla identifican la lengua correcta y anuncian la función de todos los controles interactivos.

---

### PR-11: Eliminación de hoja de estilos Bootstrap redundante en `index.html`
- **Tipo**: Rendimiento / Limpieza
- **Prioridad**: Baja
- **Archivos afectados**:
  - `index.html`
- **Problema**:
  - `index.html` importa `bootstrap.min.css` y luego `bootswatch/flatly/bootstrap.min.css`. Bootswatch Flatly ya incluye todas las clases del núcleo de Bootstrap, generando descargas y parseos CSS duplicados.
- **Solución propuesta**:
  - Eliminar la etiqueta `<link>` hacia `bootstrap.min.css` y conservar únicamente la de Bootswatch Flatly.
- **Criterio de aceptación**:
  - La apariencia visual permanece idéntica y se reduce el tiempo de bloqueo de renderizado inicial.

---

### PR-12: Pasos de test y lint en GitHub Actions y actualización a v4
- **Tipo**: CI/CD / Calidad
- **Prioridad**: Baja
- **Archivos afectados**:
  - `.github/workflows/deploy.yml`
- **Problema**:
  - El pipeline actual sólo ejecuta `npm run build` y despliega al servidor sin verificar tests unitarios ni linter. Si un commit rompe el cálculo de reparto pero compila, se despliega a producción.
  - Se utilizan versiones desactualizadas de las acciones oficiales (`actions/checkout@v3`, `actions/setup-node@v3`).
- **Solución propuesta**:
  - Actualizar a `actions/checkout@v4` y `actions/setup-node@v4`.
  - Agregar pasos de ejecución para `npm run test` y `npm run lint` previos a la compilación y despliegue.
- **Criterio de aceptación**:
  - El flujo de despliegue se detiene automáticamente si los tests o el linter fallan.

---

### PR-13: Clarificación de naming de Pagos y Reparto en UI y Código
- **Tipo**: Mejora de UX / Refactorización de Dominio
- **Prioridad**: Media
- **Archivos afectados**:
  - `src/components/PaymentsSection.vue`
  - `src/components/PaymentAddForm.vue`
  - `src/components/PaymentListItem.vue`
  - `src/components/TransfersSection.vue`
  - `src/stores/expenses.ts`
  - `src/calculator.ts`
  - `src/stores/expenses.test.ts`
- **Problema**:
  - La coexistencia de los términos "Pagos" (reembolsos manuales ya realizados entre dos personas) y "Reparto / Transferencias" (liquidación final sugerida por el algoritmo) genera confusión conceptual tanto en los usuarios de la aplicación como en el desarrollo del código.
- **Solución propuesta**:
  1. **UI**:
     - Renombrar la sección "Pagos" a "Pagos directos" o "Reembolsos" (y el botón de acción a "+ Pago directo" o "+ Registrar reembolso").
     - Renombrar la sección "Reparto" a "Reparto final" o "Liquidación de saldos" (con subtítulo descriptivo "Quién le debe a quién para quedar a mano").
  2. **Código y Dominio**:
     - Renombrar tipos e interfaces: `Payment` $\rightarrow$ `DirectPayment` o `Reimbursement`; `Transfer` $\rightarrow$ `SettlementTransfer`.
     - En el store: renombrar `payments` $\rightarrow$ `directPayments`, garantizando retrocompatibilidad en `loadState()` para migrar sin pérdida de datos los estados previos guardados en `localStorage` (`state.payments || state.directPayments`).
     - Renombrar getter `transfers` $\rightarrow$ `settlementTransfers` (o mantener un getter de compatibilidad).
- **Criterio de aceptación**:
  - La interfaz de usuario distingue con claridad meridiana los registros manuales previos de la liquidación final sugerida.
  - El código y los tipos de TypeScript reflejan semánticamente la diferencia entre entradas históricas y salidas calculadas.
  - Se mantiene retrocompatibilidad total con datos guardados previamente en `localStorage`.


