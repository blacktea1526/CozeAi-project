import { defineStore } from 'pinia'
export const useDialoguesStore = defineStore('dialogues', {
  state: () => ({
    dialogues: [],
  })
}
)
