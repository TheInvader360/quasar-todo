<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addTask"
        class="col"
        square
        filled
        bg-color="white"
        placeholder="Add task"
        dense>
        <template v-slot:append>
          <q-btn
            @click="addTask"
            round
            dense
            flat
            icon="add" />
        </template>
      </q-input>
    </div>
    <q-list
      class="bg-white"
      separator
      bordered>
      <q-item
        v-for="(task, index) in tasks"
        :key="task.info"
        @click.stop="toggleTask(index)"
        clickable
        :class="{ 'done bg-blue-1' : task.done }"
        v-ripple>
        <q-item-section avatar>
          <q-checkbox
            v-model="task.done"
            class="no-pointer-events"
            color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.info }}</q-item-label>
        </q-item-section>
        <q-item-section
          v-if="task.done"
          side>
          <q-btn
            @click.stop="removeTask(index)"
            flat
            round
            dense
            color="primary"
            icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <div
      v-if="!tasks.length"
      class="no-tasks absolute-center">
      <q-icon
        name="check"
        size="100px"
        color="primary" />
      <div class="text-h5 text-primary text-center">
        No tasks
      </div>
    </div>
  </q-page>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      newTask: '',
      tasks: []
    }
  },
  async created() {
    this.refreshTasks()
  },
  methods: {
    async refreshTasks() {
      this.tasks = await api.readTasks()
    },
    async addTask() {
      await api.createTask({info: this.newTask, done: false})
      await this.refreshTasks()
      this.newTask = ''
    },
    async toggleTask(index) {
      const task = this.tasks[index]
      await api.updateTask(task.id, {info: task.info, done: !task.done})
      await this.refreshTasks()
    },
    removeTask(index) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Really remove?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await api.deleteTask(this.tasks[index].id)
        await this.refreshTasks()
        this.$q.notify('Task removed')
      })
    }
  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }

  .no-tasks {
    opacity: 0.5;
  }
</style>
