Vue.component('person-item', {
  props: {
    person: String,
  },
  template: `
    <div class="card col-sd-12 col-md-6 col-lg-3 col-xl-2">
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
      <b-button class="delete-button" variant="outline-primary" v-on:click="onClickDelete">Delete</b-button>
      <b-button class="edit-button" variant="outline-primary" v-on:click="onClickEdit">Edit</b-button>
    </div>
  `,
  methods: {
    onClickDelete: function(event) {
      this.$emit('delete', this.person.id);
    },
    onClickEdit: function(event) {
      this.$emit('edit', this.person);
    }
  }
})

Vue.component('users-number', {
  props: ['users'],
  template: '<h3>Fetched {{ users }} users!</h3>'
})

var vue = new Vue({
  el: '#app',
  data: {
    users: [],
    userLoggedIn: false,
    // login data
    loginEmail: '',
    loginPassword: '',
    signupEmail: '',
    signupPassword: '',

    // add modal data
    firstNameAddModal: '',
    lastNameAddModal: '',
    profileImageAddModal: '',
    positionAddModal: '',
    workedForAddModal: '',
    workLocationAddModal: '',
    aboutYouAddModal: '',

    showCards: false,

    modalEditShow: false,
    modalEditData: {},
  },
  computed: {
    usersNumber: function() {
      return this.users.length;
    }
  },
  mounted: function() {
    auth.onAuthStateChanged((user) => {
      if (user) {
          console.log("user logged in", user);
          this.userLoggedIn = true;
          this.showCards = true;
      } else {
          console.log("user logged out");
          this.userLoggedIn = false;
          this.showCards = false;
      }
    });

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
    loginUser: function() {
      console.log('loginUser method called');
      try {
        auth.signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
          .then(credential => {
            console.log(credential);
            this.$refs['modal-login'].hide();
          })
          .catch(error => {
            console.log(error);
          });
        }
      finally {
        this.loginEmail = '';
        this.loginPassword = '';
      }
    },
    logoutUser: function() {
      auth.signOut();
    },
    signupUser: function() {
      console.log('signupUser method called');
      try {
        auth.createUserWithEmailAndPassword(this.signupEmail, this.signupPassword)
          .then(credential => {
            console.log(credential);
            this.$refs['modal-signup'].hide();
          })
          .catch(error => {
            console.log(error);
          })
      }
      finally {
        this.signupEmail = '';
        this.signupPassword = '';
      }
    },
    addData: function() {
      userData = {
        firstName: this.firstNameAddModal,
        lastName: this.lastNameAddModal,
        profileImage: this.profileImageAddModal,
        position: this.positionAddModal,
        workedFor: this.workedForAddModal,
        workLocation: this.workLocationAddModal,
        aboutYou: this.aboutYouAddModal
      }
      
      postData = {
        method: 'POST',
        body: JSON.stringify(userData),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'same-origin'
      }
      this.getUsers("https://us-central1-user-profile-4c1a4.cloudfunctions.net/userProfileApi/api/v1/users/", postData).then(res => {
        console.log(res);

        this.refetchUsers();

        this.$refs['modal-add'].hide();
      });
      
    },
    deleteData: function(personId) {
      const deleteData = {
        method: 'DELETE'
      }
      console.log("delete user", personId);
      this.getUsers(`https://us-central1-user-profile-4c1a4.cloudfunctions.net/userProfileApi/api/v1/users/${personId}`, deleteData).then(res => {
        console.log(res);

        this.refetchUsers();
      });
    },
    editData: function(person) {
      this.modalEditShow = true;
      this.modalEditData = person;
    },
    editDataSubmit: function() {
      putData = {
        method: 'PUT',
        body: JSON.stringify(this.modalEditData.data),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'same-origin'
      };

      this.getUsers(`https://us-central1-user-profile-4c1a4.cloudfunctions.net/userProfileApi/api/v1/users/${this.modalEditData.id}`, putData).then(res => {
        console.log(res);

        this.refetchUsers();

        this.modalEditShow = false;
      });

    },
    refetchUsers: function() {
      this.getUsers("https://us-central1-user-profile-4c1a4.cloudfunctions.net/userProfileApi/api/v1/users/").then(res => {
        console.log(res);
        this.users = res;
      });
    }
  },
})



