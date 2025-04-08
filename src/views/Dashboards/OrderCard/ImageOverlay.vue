<template>
    <div class="image-overlay">
        <img :src="imageSrc" alt="Image Overlay" @click="verOverlay" v-if="imageSrc" @error="handleImageError"/>
      <div v-if="overlayVisible" class="overlay">
        <section class="cardImageText">
          <img :src="imageSrc" class="fullImageCard" @error="handleImageError" />
        </section>
        <section class="cardImageText">
          <div class="text">
            <h1>{{ title }}</h1>
            
            <p class="aumentarsize" style="color:black !important"><b>Motivo:</b> {{ motivo }}</p>
           
            <p class="aumentarsize">
              <b style="color:black !important">Nota taller:</b>
              {{notaTaller}}
            </p>
           
            
            <button @click="verOverlay">Cerrar</button>
          </div>
        </section>
      </div>
    </div>
</template>
<style scoped>
.image-overlay   {
  width: 100%;
  height: 100%;
}
.image-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-overlay .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.image-overlay .overlay .text {
  color: white;
  text-align: center;
}
.image-overlay .overlay .text h1 {
  font-size: 2em;
}
.image-overlay .overlay .text h3 {
  font-size: 1.5em;
}
.image-overlay .overlay .text p {
  font-size: 1.4em;
}
.aumentarsize{
  font-size: 1.4em;
      color: #EC0609;
    font-weight: bold;
    font-family: arial;
}
.image-overlay .overlay .text span {
  font-size: 1.2em;
}
.image-overlay .overlay .text button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
.image-overlay .overlay .text button:hover {
  background-color: #0056b3;
}
.image-overlay .overlay .fullImageCard {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}
.image-overlay .overlay .cardImageText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: white;
  padding: 1em;
  border-radius: 15px;
  margin: 1em;
  min-width: 40vw;
}
.image-overlay .overlay .cardImageText .text {
  margin: 20px;
}
.image-overlay .overlay .cardImageText .text h1 {
  margin-bottom: 10px;
}
.image-overlay .overlay .cardImageText .text p {
  margin-bottom: 20px;
}
.image-overlay .overlay .cardImageText .text button {
  margin-top: 10px;
}
.image-overlay .overlay .cardImageText .text button:hover {
  background-color: #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard {
  margin: 20px;
}
.image-overlay .overlay .cardImageText .fullImageCard:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
}
.image-overlay .overlay .cardImageText .fullImageCard:active {
  transform: scale(1);
  transition: transform 0.3s;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus {
  outline: none;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible {
  outline: 2px solid #007BFF;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:hover {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:active {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible:hover {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible:active {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible:focus {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible:focus-visible {
  outline: 2px solid #0056b3;
}
.image-overlay .overlay .cardImageText .fullImageCard:focus-visible:focus-visible:focus-visible:hover {
  outline: 2px solid #0056b3;
}  
</style>
<script>
import { vito } from '../../../config/pluginInit'
export default {
    name: 'ImageOverlay',
    data() {
        return {
            overlayVisible: false
        };
    },
    props: {
        imageSrc: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            default: 'Click Me'
        },
        textoPersonalizado: {
            type: String,
            default: 'No disponible'
        },
          notaTaller: {
            type: String,
            default: 'No disponible'
        },
        motivo: {
            type: String,
            default: 'No disponible'
        }
    },
    methods: {
        onButtonClick() {
            this.$emit('button-click');
        },
        verOverlay() {
            this.overlayVisible = !this.overlayVisible;
        },
        handleImageError(event) {
            event.target.src = "https://placehold.co/600x400";// Replace with a default image path
        },
        limpiarHtml(texto){
            if(texto === null || texto === undefined){
                return 'No disponible';
            }
            // Eliminar etiquetas HTML
            const textoSinHtml = texto.replace(/<[^>]*>/g, '');
            // Reemplazar caracteres especiales
            const textoLimpio = textoSinHtml.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            return textoLimpio;
        }
    },
    mounted() {
        vito.index();
    }
};
</script>