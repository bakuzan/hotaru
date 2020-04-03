<template>
  <div v-show="hasAlert" :class="alertClasses">
    <div v-show="hasAlert" :class="messageClasses">
      <div class="alert__inner">
        <div :class="iconClasses"></div>
        <div class="alert__title">
          {{ activeAlert.message }}
        </div>
        <div class="button-group button-group--shrink">
          <Button
            :icon="expandIcon"
            size="small"
            @click="showDetail(activeAlert.id)"
          />
          <Button
            :icon="closeIcon"
            size="small"
            @click="remove(activeAlert.id)"
          />
        </div>
      </div>
      <div v-show="activeAlert.showDetail" class="alert__detail">
        {{ activeAlert.detail }}
      </div>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';
import Icons from '@/constants/icons';
import alertService from '@/utils/alertService';

export default {
  name: 'Alert',
  components: {
    Button
  },
  data: function () {
    return {
      closeIcon: Icons.cross,
      alerts: []
    };
  },
  computed: {
    expandIcon: function () {
      return this.alerts.some((x) => x.showDetail) ? Icons.up : Icons.down;
    },
    hasAlert: function () {
      return !!this.alerts.length;
    },
    activeAlert: function () {
      return this.hasAlert ? this.alerts[0] : {};
    },
    alertType: function () {
      return this.activeAlert.type || 'default';
    },
    alertClasses: function () {
      return classNames('alert', {
        'alert--is-expanded': this.activeAlert.showDetail
      });
    },
    messageClasses: function () {
      return classNames('alert__message', [
        `alert__message--type_${this.alertType}`
      ]);
    },
    iconClasses: function () {
      return classNames('alert__icon', [`alert__icon--type_${this.alertType}`]);
    }
  },
  created() {
    alertService.register(this);
  },
  methods: {
    showDetail: function (alertId) {
      this.alerts = this.alerts.map((x) =>
        x.id !== alertId ? x : { ...x, showDetail: !x.showDetail }
      );
    },
    remove: function (alertId) {
      this.alerts = this.alerts.filter((x) => x.id !== alertId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

$alert-container-height: 40px;
$alert-left-margin: 10px;
$alert-icon-padding: 10px;
$alert-icon-width: $alert-container-height;
$font-size: 16px;

.alert {
  position: fixed;
  top: 50px;
  left: 50%;
  width: 50%;
  height: $alert-container-height;
  transform: translateX(-50%);
  z-index: map-get($z-index, alert);

  &--is-expanded {
    height: auto;
  }

  &__inner {
    display: flex;
    flex: 1;
  }

  &__message {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    color: #000;
    padding: 0;
    border-radius: inherit;
    margin: 0;
    box-shadow: 1px 1px 10px 1px;
    z-index: map-get($z-index, above-siblings);
  }

  &__title {
    @extend %center-contents;
    justify-content: space-between;
    flex: 1;
    margin-left: 10px;
    font-size: $font-size;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $alert-icon-width;
    height: $alert-icon-width;
    color: #fff;
    padding: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

@each $type, $values in $ui-messaging {
  $background: map-get($values, background);
  $colour: map-get($values, colour);
  $content: map-get($values, icon);

  .alert__icon--type_#{$type} {
    background-color: $background;
    color: $colour;
    &::before {
      content: $content;
    }
  }
}

.alert__detail {
  display: none;
  padding: 10px 0 {
    left: 5px;
  }
  margin-left: $alert-icon-width;
  white-space: pre-line;
  word-wrap: break-word;
}

.alert--is-expanded .alert__detail {
  display: flex;
  width: auto;
  overflow: hidden;
}
</style>
