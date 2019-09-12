<template>
  <div class="image-controls-container" v-if="nbSlices > 1">

    <div class="image-dimension" v-if="image.channels > 1">
      <strong class="image-dimension-name">C</strong>
      <div class="buttons has-addons">
        <button
          class="button is-small item"
          :disabled="currentSlice.channel < 1"
          @click="shift('channel', -Math.min(step, currentSlice.channel))"
        >
          <i class="fas fa-fast-backward"></i>
          <div class="step-counter">-{{step}}</div>
        </button>
        <button
          class="button is-small item"
          :disabled="currentSlice.channel < 1"
          @click="shift('channel', -1)"
        >
          <i class="fas fa-step-backward"></i>
        </button>
      </div>

      <cytomine-slider v-model="currentChannel" :max="image.channels - 1" :integer-only="true" class="image-dimension-slider" />

      <div class="buttons has-addons">
        <button
          class="button is-small item"
          :disabled="currentSlice.channel >= image.channels - 1"
          @click="shift('channel', 1)"
        >
          <i class="fas fa-step-forward"></i>
        </button>
        <button
          class="button is-small item"
          :disabled="currentSlice.channel >= image.channels - 1"
          @click="shift('channel', Math.min(step, image.channels - currentSlice.channel - 1))"
        >
          <i class="fas fa-fast-forward"></i>
          <div class="step-counter">+{{step}}</div>
        </button>
      </div>
    </div>

    <div class="image-dimension" v-if="image.depth > 1">
      <strong class="image-dimension-name">Z</strong>
      <div class="buttons has-addons">
        <button
          class="button is-small"
          :disabled="currentSlice.zStack < 1"
          @click="shift('zStack', -Math.min(step, currentSlice.zStack))"
        >
          <i class="fas fa-fast-backward"></i>
          <div class="step-counter">-{{step}}</div>
        </button>

        <button
          class="button is-small"
          :disabled="currentSlice.zStack < 1"
          @click="shift('zStack', -1)"
        >
          <i class="fas fa-step-backward"></i>
        </button>
      </div>

      <cytomine-slider v-model="currentZStack" :max="image.depth - 1" :integer-only="true" class="image-dimension-slider" />

      <div class="buttons has-addons">
        <button
          class="button is-small"
          :disabled="currentSlice.zStack >= image.depth - 1"
          @click="shift('zStack', 1)"
        >
          <i class="fas fa-step-forward"></i>
        </button>
        <button
          class="button is-small"
          :disabled="currentSlice.zStack >= image.depth - 1"
          @click="shift('zStack', Math.min(step, image.depth - currentSlice.zStack - 1))"
        >
          <i class="fas fa-fast-forward"></i>
          <div class="step-counter">+{{step}}</div>
        </button>
      </div>
    </div>

    <div class="image-dimension" v-if="image.duration > 1">
      <strong class="image-dimension-name">T</strong>

      <div class="buttons has-addons">
        <button
          class="button is-small"
          :disabled="currentSlice.time < 1"
          @click="shift('time', -Math.min(step, currentSlice.time))"
        >
          <i class="fas fa-fast-backward"></i>
          <div class="step-counter">-{{step}}</div>
        </button>
        <button
          class="button is-small"
          :disabled="currentSlice.time < 1"
          @click="shift('time', -1)"
        >
          <i class="fas fa-step-backward"></i>
        </button>
      </div>

      <div class="buttons has-addons">
        <button
          class="button is-small"
        >
          <i class="fas fa-play"></i>
        </button>
      </div>

      <cytomine-slider v-model="currentTime" :max="image.duration - 1" :integer-only="true" class="image-dimension-slider" >
        <template v-if="image.fps" #default="{ value }">
          {{formatMinutesSeconds(value / image.fps)}} | {{value}}
        </template>
      </cytomine-slider>

      <div class="buttons has-addons">
        <button
          class="button is-small"
          :disabled="currentSlice.time >= image.duration - 1"
          @click="shift('time', 1)"
        >
          <i class="fas fa-step-forward"></i>
        </button>
        <button
          class="button is-small"
          :disabled="currentSlice.time >= image.duration - 1"
          @click="shift('time', Math.min(step, image.duration - currentSlice.time - 1))"
        >
          <i class="fas fa-fast-forward"></i>
          <div class="step-counter">+{{step}}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CytomineSlider from '@/components/form/CytomineSlider';

import {formatMinutesSeconds} from '@/utils/video-utils.js';

export default {
  name: 'image-controls',
  components: {CytomineSlider},
  data() {
    return {
      step: 2, // TODO: add into configuration
    };
  },
  props: {
    index: String
  },
  computed: {
    viewerModule() {
      return this.$store.getters['currentProject/currentViewerModule'];
    },
    imageModule() {
      return this.$store.getters['currentProject/imageModule'](this.index);
    },
    viewerWrapper() {
      return this.$store.getters['currentProject/currentViewer'];
    },
    imageWrapper() {
      return this.viewerWrapper.images[this.index];
    },
    image() {
      return this.imageWrapper.imageInstance;
    },
    currentSlice() {
      return this.imageWrapper.activeSlice;
    },
    nbSlices() {
      return this.image.depth * this.image.duration * this.image.channels;
    },
    currentChannel: {
      get() {
        return this.currentSlice.channel;
      },
      set(value) {
        this.seek(value, this.currentSlice.zStack, this.currentSlice.time);
      }
    },
    currentZStack: {
      get() {
        return this.currentSlice.zStack;
      },
      set(value) {
        this.seek(this.currentSlice.channel, value, this.currentSlice.time);
      }
    },
    currentTime: {
      get() {
        return this.currentSlice.time;
      },
      set(value) {
        this.seek(this.currentSlice.channel, this.currentSlice.zStack, value);
      }
    },
  },
  methods: {
    shift(dimension, increment) {
      let time = (dimension === 'time') ? this.currentSlice.time + increment : this.currentSlice.time;
      let channel = (dimension === 'channel') ? this.currentSlice.channel + increment : this.currentSlice.channel;
      let zStack = (dimension === 'zStack') ? this.currentSlice.zStack + increment : this.currentSlice.zStack;
      this.seek(channel, zStack, time);
    },
    seek(channel, zStack, time) {
      this.$store.dispatch(this.imageModule + 'setActiveSliceByRank', {time, channel, zStack});
      this.$eventBus.$emit('reloadAnnotations', {idImage: this.image.id});
    },
    formatMinutesSeconds(time) {
      return formatMinutesSeconds(time);
    }
  }
};
</script>

<style lang="scss" scoped>
.image-controls-container {
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 1px #777;
  background: white;
  display: flex;
  flex-direction: column;
}

.image-dimension {
  display: flex;
  align-items: center;
}

.image-dimension-name {
  padding-right: 0.5rem;
  width: 1rem;
}

.buttons {
  float:left;
  margin: 1px;
  margin-bottom: 0 !important;

  .button {
    margin-bottom: 0;
  }
}

.image-dimension-slider {
  flex-grow: 3;
}

.step-counter {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
  font-size: 0.7em;
  font-weight: 600;
  text-align:right;
  line-height: 0.9em;
}

</style>

<style>
.image-dimension .vue-slider {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>