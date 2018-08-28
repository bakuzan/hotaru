<template>
  <div class="home">
    <VersusWidget
      v-for="versus in activeDailyVersus"
      v-bind="versus"
      :key="versus.id"
    />
  </div>
</template>

<script>
import VersusWidget from '@/components/VersusWidget';

import { Query } from '@/graphql';

export default {
  name: 'home',
  components: {
    VersusWidget
  },
  data: function() {
    return {
      activeDailyVersus: []
    };
  },
  apollo: {
    activeDailyVersus: {
      query: Query.getActiveDailyVersus
    }
  }
};
</script>
