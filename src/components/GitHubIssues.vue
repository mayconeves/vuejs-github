<template lang="html">
    <div class="container">
      <h1>Vuejs + Github</h1>
      <p class="lead">
          Página que lista issues de um repositório do Guthub, usando Vue.js
      </p>

      <div class="row">
          <div class="col">
              <div class="form-group">
                  <input v-model="username" type="text"
                  class="form-control" placeholder="github username">
              </div>
          </div>

          <div class="col">
              <div class="form-group">
                  <input v-model="repository" type="text"
                  class="form-control" placeholder="github repositório">
              </div>
          </div>


      <div class="col-3">
          <div class="form-group">
              <button @click.prevent.stop="getIssues()" class="btn btn-success">GO</button>
              <button @click.prevent.stop="reset()" class="btn btn-danger">LIMPAR</button>
          </div>
      </div>
    </div>

    <div v-if="response.status === 'error'" class="alert alert-danger">
        {{ response.message }}
    </div>

      <hr>
      <br>

      <!-- <template v-if="selectedIssue.id">
        <h2>{{ selectedIssue.title }}</h2>
        <div>
          {{ selectedIssue.body }}
        </div>
        <a @click.prevent.stop="clearIssue()"
          href="#"
          class="btn btn-primary">
          Voltar
      </a>
      </template> -->

      <table class="table table-sm table-bordered">

          <thead>
              <tr>
                  <th width="100">Número</th>
                  <th>Título</th>
              </tr>
          </thead>

         <tbody>
              <tr v-if="loader.getIssues || loader.getIssue">
                  <td class="text-center" colspan="2">
                      <img src="/static/loading.svg" alt="">
                  </td>
              </tr>
              <template v-if="!loader.getIssue">
                  <tr v-if="showIssues"
                    v-for="issue in issues"
                    :key="issue.number">
                      <td>
                          <router-link :to="{ name: 'GitHubIssue', params: {
                            username: username,
                            repository: repository,
                            issue: issue.number
                            } }"> {{ issue.number }}</router-link>
                      </td>
                      <td>{{ issue.title }}</td>
                  </tr>
                  </template>
                  <tr v-if="noIssues">
                      <td class="text-center" colspan="2">Nenhuma issue encontrada!</td>
                  </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GitHubIssues',

  created() {
    this.getLocalData();
  },

  data() {
    return {
      username: '',
      repository: '',
      issues: [],
      response: {
        status: '',
        message: '',
      },
      loader: {
        getIssues: false,
        getIssue: false,
      },
    };
  },

  computed: {
    showIssues() {
      return !!this.issues.length && !this.loader.getIssues;
    },
    noIssues() {
      return !this.issues.length && !this.loader.getIssues;
    },
  },

  methods: {
    reset() {
      this.username = '';
      this.repository = '';
      this.issues = [];
      this.response = [];
      this.selectedIssue = [];
      localStorage.removeItem('gitHubIssues');
    },

    resetResponse() {
      this.response.status = '';
      this.response.message = '';
    },

    getIssues() {
      this.resetResponse();
      this.issues = [];

      if (this.username && this.repository) {
        // local storage
        localStorage.setItem('gitHubIssues',
          JSON.stringify({ username: this.username, repository: this.repository }));
        this.loader.getIssues = true;
        const url = `https://api.github.com/repos/${this.username}/${this.repository}/issues`;
        // ignorar erro eslint
        // eslint-disable-next-line
        // console.log('here');
        axios.get(url).then((response) => {
          this.issues = response.data;
          // eslint-disable-next-line
          //console.log(response.body);
        }).catch(() => {
          this.response.status = 'error';
          this.response.message = 'Repositório não existe!';
        }).finally(() => {
          this.loader.getIssues = false;
        });
      }
    },

    getLocalData() {
      const localData = JSON.parse(localStorage.getItem('gitHubIssues'));
      // eslint-disable-next-line
      // console.log(localData);
      if (localData && localData.username && localData.repository) {
        this.username = localData.username;
        this.repository = localData.repository;
        this.getIssues();
      }
    },
  },
};
</script>

<style lang="css">
</style>
