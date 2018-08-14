<template>
    <DropdownMenu
        :id="id"
        :portal-target="target"
        :align="alignment"
        :title="title"
    >
        <li>
            Placeholder item
        </li>
    </DropdownMenu>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';

import Strings from '@/constants/strings';

export default {
  name: 'AppSettings',
  components: {
    DropdownMenu
  },
  data: function() {
    return {
      id: 'app-settings',
      target: Strings.portalName,
      alignment: Strings.right,
      title: 'App Settings'
    };
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
</style>
