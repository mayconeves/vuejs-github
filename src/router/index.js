import Vue from 'vue';
import Router from 'vue-router';
import GitHubIssues from '@/components/GitHubIssues';
import GitHubIssue from '@/components/GitHubIssue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GitHubIssues',
      component: GitHubIssues,
    },
    {
      path: '/:username/:repository/:issue',
      name: 'GitHubIssue',
      component: GitHubIssue,
    },
  ],
});
