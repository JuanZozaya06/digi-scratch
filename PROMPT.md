Crea un proyecto Angular para una demo/wireframe de una landing promocional tipo “Raspa y Gana”.

Objetivo:
Crear únicamente la app pública de usuario para mostrar al cliente el flujo visual antes de aprobar el desarrollo completo. No debe tener conexión a backend, base de datos ni APIs reales. Toda la data debe ser mock/local.

Tecnología:

* Angular con estructura tradicional basada en NgModules.
* No usar standalone components.
* Usar `AppModule`.
* Usar componentes declarados dentro de módulos.
* TypeScript.
* HTML/SCSS.
* No usar librerías externas innecesarias.
* No usar branding real.
* Colores neutros: blanco, gris claro, gris oscuro, azul suave como acento.
* Diseño mobile-first, responsive y limpio.
* Debe verse como wireframe/prototipo presentable, no como diseño final de marca.

Estructura sugerida:

* `src/app/app.module.ts`
* `src/app/app.component.ts`
* `src/app/app.component.html`
* `src/app/app.component.scss`

Crear los siguientes componentes no standalone:

* `LandingIntroComponent`
* `ParticipantFormComponent`
* `ScratchCardComponent`
* `ResultComponent`
* `ParticipantSummaryComponent`

Todos los componentes deben tener:

* `standalone: false` o no incluir la propiedad `standalone`.
* Declararse dentro de `AppModule`.
* Usar archivos separados `.ts`, `.html` y `.scss`.

Importar en `AppModule`:

* `BrowserModule`
* `FormsModule`
* `ReactiveFormsModule`

No usar Angular standalone bootstrap. Usar la estructura clásica con:

* `main.ts` haciendo bootstrap de `AppModule`.
* `platformBrowserDynamic().bootstrapModule(AppModule)`.

Flujo requerido:

1. Pantalla inicial / landing.
2. Formulario de participación.
3. Pantalla tipo “raspa y gana”.
4. Pantalla de resultado.
5. Mensaje para ir al stand en caso de premio ganador.
6. Resumen de datos del participante.

Formulario:
Debe solicitar:

* Nombre
* Apellido
* Cédula
* Teléfono
* Correo

Validaciones básicas:

* Todos los campos requeridos.
* Correo con formato válido.
* Teléfono requerido.
* Cédula requerida.
* Botón deshabilitado si el formulario no es válido.

Comportamiento:

* Al iniciar, mostrar la landing.
* Al presionar “Comenzar”, mostrar el formulario.
* Al enviar el formulario válido, pasar a la pantalla de “raspa y gana”.
* No conectar con backend.
* Simular la asignación de premio con una función local.
* El resultado debe salir de una lista mock.
* Guardar participante y resultado en `localStorage`.
* Si el usuario refresca y ya existe data en `localStorage`, mostrar directamente el resultado o resumen.
* Incluir botón “Reiniciar demo” para limpiar `localStorage` y volver al inicio.

Resultados mock:
Crear un array local con posibles resultados:

* “Sigue intentando”
* “Gracias por participar”
* “Ganaste una calcomanía”
* “Ganaste una pulsera”
* “Ganaste 1 sobre de barajitas”
* “Ganaste un balón del Mundial”

Para la demo, seleccionar el resultado aleatoriamente en frontend.

Pantalla “Raspa y gana”:

* Mostrar una tarjeta grande centrada.
* La tarjeta debe tener un estado inicial cerrado con el texto: “Raspa aquí”.
* No implementar animación real de raspado.
* Simular el raspado con un botón o click sobre la tarjeta.
* Al hacer click o presionar el botón “Raspar”, revelar el resultado.
* Mostrar una transición simple de estado, pero sin animaciones complejas.
* Puede mostrar un placeholder visual tipo tarjeta gris.

Resultado:
Si el resultado es ganador, mostrar:

* Título: “¡Felicidades!”
* Texto: “Ganaste [premio].”
* Mensaje: “Dirígete al stand para validar tus datos y retirar tu premio.”
* Botón: “Ver mis datos”

Si el resultado no es ganador, mostrar:

* Título: “Gracias por participar”
* Texto con el resultado correspondiente.
* Botón: “Finalizar”

Datos del participante:
Después del resultado, debe poder mostrarse un resumen con:

* Nombre y apellido
* Cédula
* Teléfono
* Correo
* Resultado obtenido

Interfaces:
Crear interfaces en TypeScript:

```ts
export interface Participant {
  firstName: string;
  lastName: string;
  documentId: string;
  phone: string;
  email: string;
}

export interface PrizeResult {
  id: string;
  label: string;
  isWinner: boolean;
  prizeName?: string;
}
```

Estado del flujo:
Crear un tipo para manejar las pantallas:

```ts
type FlowStep = 'landing' | 'form' | 'scratch' | 'result' | 'summary';
```

Estilo visual:

* Centrar el contenido en una card principal.
* Máximo ancho desktop: 480px a 640px.
* En mobile ocupar casi todo el ancho.
* Fondo gris claro.
* Cards blancas con borde suave y sombra ligera.
* Botones con color azul neutro.
* Tipografía sans-serif del sistema.
* Espaciado limpio.
* No usar logos ni nombres de marcas.
* No usar imágenes reales.

Contenido de ejemplo:
Título landing:

“Participa y descubre tu premio”

Subtítulo:

“Completa tus datos, raspa la tarjeta y conoce tu resultado.”

Texto legal pequeño:

“Demo visual. Los resultados mostrados son simulados.”

Botones:

* “Comenzar”
* “Participar”
* “Raspar”
* “Ver mis datos”
* “Reiniciar demo”

Criterios de aceptación:

* La app corre con `ng serve`.
* Usa `AppModule`, no standalone components.
* Todos los componentes están declarados en un módulo.
* El usuario puede completar el formulario.
* El sistema valida los campos.
* El usuario puede pasar a la tarjeta de raspa y gana.
* El resultado se revela al hacer click o presionar el botón.
* El resultado queda guardado en `localStorage`.
* Al refrescar, se muestra el resultado ya generado.
* Se puede reiniciar la demo.
* No hay conexión a backend.
* No hay marca visual del cliente.
* El código queda preparado para reemplazar luego la función mock por una llamada real al backend.

Entrega los archivos completos modificados y explica brevemente cómo correr el proyecto.
