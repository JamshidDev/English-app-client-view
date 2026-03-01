<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguage, languages } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'

const { t } = useI18n()
const { currentLanguage, setLanguage } = useLanguage()
const { hapticImpact } = useTelegram()

const showPicker = ref(false)

const handleSelect = (lang: typeof languages[0]) => {
  hapticImpact('light')
  setLanguage(lang.code)
  showPicker.value = false
}
</script>

<template>
  <div>
    <van-cell
      :title="t('profile.language')"
      is-link
      @click="showPicker = true"
    >
      <template #value>
        <span class="flex items-center gap-2">
          <span>{{ languages.find(l => l.code === currentLanguage)?.flag }}</span>
          <span>{{ languages.find(l => l.code === currentLanguage)?.label }}</span>
        </span>
      </template>
    </van-cell>

    <van-action-sheet
      v-model:show="showPicker"
      :actions="languages.map(l => ({ name: `${l.flag} ${l.label}`, value: l.code }))"
      cancel-text="Cancel"
      @select="(action) => handleSelect(languages.find(l => l.code === action.value)!)"
    />
  </div>
</template>
