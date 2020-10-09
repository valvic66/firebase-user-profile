Vue.component('person-item', {
  props: ['person'],
  template: `
    <div class="card col-12 col-sd-6 col-md-4 col-lg-3 col-xl-2">
      <div class="card-body">
        <h5 class="card-title">User card</h5>
        <p class="card-text">{{ person.id }}</p>
        <p class="card-text">{{ person.data.firstName }}</p>
        <p class="card-text">{{ person.data.lastName }}</p>
        <p class="card-text">{{ person.data.profileImage }}</p>
        <p class="card-text">{{ person.data.position }}</p>
        <p class="card-text">{{ person.data.workedFor }}</p>
        <p class="card-text">{{ person.data.workLocation }}</p>
        <p class="card-text">{{ person.data.aboutYou }}</p>
      </div>
    </div>
  `
})

Vue.component('users-number', {
  props: ['users'],
  template: '<h3>Fetched {{ users }} users!</h3>'
})

var vue = new Vue({
  el: '#app',
  data: {
    users: [],
  },
  computed: {
    usersNumber: function() {
      return this.users.length;
    }
  },
  mounted: function() {
    this.getUsers("https://us-central1-user-profile-4c1a4.cloudfunctions.net/userProfileApi/api/v1/users/").then(res => {
      console.log(res);
      this.users = res;
    });
  },
  methods: {
    getUsers: async function(url = '', data = {}) {
      const response = await fetch(url, data);
      const json = await response.json();
        
      return json;
    },

  },
  
})



