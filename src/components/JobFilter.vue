<template>
  <Panel header="Filter Results" class="shadow-1 border-round-xl overflow-hidden">
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label class="font-bold">Keyword</label>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText placeholder="Search titles..." class="w-full" />
        </span>
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Category</label>
        <Dropdown placeholder="Select Category" class="w-full" />
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-bold">Workplace Type</label>
        <div class="flex flex-column gap-2">
          <div class="flex align-items-center gap-2">
            <Checkbox value="Remote" inputId="remote" />
            <label for="remote">Remote</label>
          </div>
          <div class="flex align-items-center gap-2">
            <Checkbox value="On-site" inputId="onsite" />
            <label for="onsite">On-site</label>
          </div>
        </div>
      </div>

      <Button
        label="Clear Filters"
        icon="pi pi-filter-slash"
        class="p-button-text p-button-sm mt-2"
      />
    </div>
  </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
</script>
