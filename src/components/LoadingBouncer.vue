<template>
  <div class="loading-bouncer loading-bouncer--fixed">
    <div 
        v-for="i in range" 
        :key="i" 
        class="loading-bouncer__circle themed-background" 
    />
  </div>
</template>

<script>
export default {
  name: 'LoadingBouncer',
  data: function() {
    return { range: [1, 2, 3] };
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

@keyframes bouncing {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0.1;
    transform: translateY(-1rem);
  }
}

.loading-bouncer {
  display: flex;
  justify-content: center;

  &--fixed {
    position: fixed;
    top: 50px;
    right: 0;
  }

  &__circle {
    width: 1rem;
    height: 1rem;
    margin: 1.5rem 0.2rem;
    border-radius: 50%;
    animation: bouncing 0.6s infinite alternate;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}
</style>
