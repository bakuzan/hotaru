<template>
    <div :id="id" class="logo center-contents">
        <svg class="logo__svg themed-background" xmlns="http://www.w3.org/2000/svg">
            <text 
                v-for="(item, i) in letters"
                :key="i"
                :class="item.classes" 
                x="50%" 
                y="50%" 
                dy="0.3em"
            >
                {{item.text}}
            </text>
            <text
                class="word diagonal"
                x="50%"
                y="50%"
                dy="0.3em"
                :textLength="sideLength"
                lengthAdjust="spacingAndGlyphs"
            >
            {{upperText}}
            </text>
        </svg>
    </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    id: String
  },
  data: function() {
    return {
      animateClass: 'hideshow',
      letterClass: 'letter',
      text: 'hotaru',
      letters: [],
      sideLength: 50,
      interval: null
    };
  },
  computed: {
    upperText: function() {
      return this.text.toUpperCase();
    }
  },
  created() {
    this.letters = this.upperText.split('').map((text) => ({
      text,
      classes: this.letterClass
    }));
  },
  mounted() {
    this.cycleCharacters();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    cycleCharacters: function() {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        const letterIndex = this.letters.findIndex(
          (x) => x.classes.indexOf(this.animateClass) > -1
        );

        const nextLetterIndex =
          letterIndex + 1 < this.letters.length ? letterIndex + 1 : 0;

        if (letterIndex !== -1 && this.letters[letterIndex]) {
          this.letters[letterIndex].classes = this.letterClass;
        }

        const nextLetter = this.letters[nextLetterIndex];
        if (!nextLetter) return;

        nextLetter.classes = `${this.letterClass} ${this.animateClass}`;
      }, 3000);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.logo {
  width: 50px;
  height: 50px;
}
.logo__svg {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  padding: 0.25em 0.25em 0;
  box-sizing: border-box;
  &:not(:hover) {
    .letter {
      opacity: 0;
    }
    .letter.hideshow {
      animation: {
        duration: 3s;
        iteration-count: 1;
        timing-function: linear;
        name: hideshow;
      }
    }
  }

  &:hover {
    > .word {
      opacity: 1;
    }
    > .letter {
      opacity: 0 !important;
    }
  }
}

.word,
.letter {
  text-anchor: middle;
  fill: $black;
}

.word {
  text-anchor: end;
  font-size: 0.9em;
  transition: all 1s ease-in-out;
  opacity: 0;
}

.letter {
  text-anchor: middle;
  font-size: 3em;
  transition: all 1s ease-in-out;
}

.diagonal {
  transform: translateX(0.6em) translateY(0.125em) rotate(-45deg);
}

@keyframes hideshow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
