<template>
    <DropdownMenu
        :id="id"
        :portal-target="target"
        :align="alignment"
        :title="title"
        :icon="icon"
    >
        <li>
            Placeholder item
        </li>
    </DropdownMenu>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';

import Strings from '@/constants/strings';
import Icons from '@/constants/icons';

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
      title: 'App Settings',
      icon: Icons.settings
    };
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
</style>
