<template>
    <div class="text-xs-center">
      <v-dialog persistent width="300" v-model="visible">
        <v-card color="primary" dark>
          <v-card-text>
            Attendere...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>    
</template>

<script>
export default {
  computed: {
    visible() {
      return this.$store.getters.getWaitDialogVisible
    }
  }
}
</script>