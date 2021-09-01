<template>
    <div>
       <div class="content">
			<div class="container-fluid">
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Admins 
						<Button @click="addModal=true" v-if="isWritePermitted"><Icon type="md-add" />Add admin</Button>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
							<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Email</th>
								<th>User type</th>
								<th>Created at</th>
								<th>Action</th>
							</tr>
							<!-- TABLE TITLE -->

							<!-- ITEMS -->
							<tr v-for="(user, i) in users" :key="i" v-if="users.length">
								<td>{{user.id}}</td>
								<td class="_table_name">{{user.fullName}}</td>
								<td>{{user.email}}</td>
								<td>{{user.userType}}</td>
								<td>{{user.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(user, i)" v-if="isUpdatePermitted">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal(user, i)"  :loading="user.isDeleting" v-if="isDeletePermitted">Delete</Button>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<!-- admin adding modal -->
				<Modal
					v-model="addModal"
					title="Add Admin"
					:mask-closable="false"
					:closable="false">
                    <div class="space"> 
					    <Input type="text" v-model="data.fullName" placeholder="Full name" />
                    </div>
                    <div class="space"> 
					    <Input type="email" v-model="data.email" placeholder="Email" />
                    </div>
                    <div class="space"> 
					    <Input type="password" v-model="data.password" placeholder="Password" />
                    </div>
                    <div class="space">
                        <Select v-model="data.role_id"  placeholder="Select admin type">
                            <Option :value="role.id" v-for="(role, i) in roles" :key="i" v-if="roles.length">{{role.roleName}}</Option>
                            <!-- <Option value="Admin" >Admin</Option> -->
                            <!-- <Option value="Editor" >Editor</Option> -->
                        </Select>
                    </div>
					<div slot="footer">
						<Button type="default" @click="addModal=false">Close</Button>
						<Button 
							type="primary" 
							@click="addAdmin" 
							:disabled="isAdding" 
							:loading="isAdding">
							{{isAdding ? 'Adding..' : 'Add admin'}}
						</Button>
					</div>
				</Modal>

				<!-- admin editing modal -->
				<Modal
					v-model="editModal"
					title="Edit admin"
					:mask-closable="false"
					:closable="false"
					>
                    <div class="space"> 
					    <Input type="text" v-model="editData.fullName" placeholder="Full name" />
                    </div>
                    <div class="space"> 
					    <Input type="email" v-model="editData.email" placeholder="Email" />
                    </div>
                    <div class="space"> 
					    <Input type="password" v-model="editData.password" placeholder="Password" />
                    </div>
                    <div class="space">
                        <Select v-model="editData.role_id"  placeholder="Select admin type">
							<Option :value="role.id" v-for="(role, i) in roles" :key="i" v-if="roles.length">{{role.roleName}}</Option>
                            <!-- <Option value="Admin" >Admin</Option> -->
                            <!-- <Option value="Editor" >Editor</Option> -->
                        </Select>
                    </div>
					<div slot="footer">
						<Button type="default" @click="editModal=false">Close</Button>
						<Button 
							type="primary" 
							@click="editAdmin" 
							:disabled="isEditing" 
							:loading="isEditing">
							{{isEditing ? 'Editing..' : 'Edit admin'}}
						</Button>
					</div>
				</Modal>

				<!-- delete alert modal -->
				<deleteModal></deleteModal>
			</div>
		</div>
    </div>
</template>

<script>
import deleteModal from '../components/deleteModel.vue'
import { mapGetters } from 'vuex'

export default {
	data(){
		return {
			// get tag list items
			users: [], 
			// adding
			data : {
                fullName: '',
				email: '',
				password: '',
				// userType: 'Admin',
				role_id: null
			},
			addModal: false, // hide add nodel
			isAdding: false,
			// editing
			editModal : false, // hide edit model
			editData : {
				tagName: ''
			},
			isEditing: false,
			index: -1, // store the id editing of item
			// deleting
			showDeleteModal: false, // hide delete model
			isDeleing : false,
			deleteItem: {}, // store the tag object, it will has been deleted
			deletingIndex: -1,  // store the id deleting of item
			roles: []
		}
	},
	methods: {
		async addAdmin() {
            if(this.data.fullName.trim()=='') {
                return this.e('Full name is required')
            }
            if(this.data.email.trim()=='') {
                return this.e('Email is required')
            }
			if(this.data.password.trim()=='') {
                return this.e('Password is required')
            }
			// if(this.data.userType.trim()=='') {
            //     return this.e('User Type is required')
            // }
            if(!this.data.role_id) {
                return this.e('Admin type is required')
            }

			const res = await this.callApi('post', 'app/create_user', this.data)

			if(res.status===201) {
				this.users.unshift(res.data)
				this.s('Tag has been added successfully!')
				this.addModal = false
				this.data.fullName = ''
				this.data.email = ''
				this.data.password = ''
				// this.data.userType = ''
				this.data.role_id = ''
			} else {
				if(res.status==422){
                    for(let i in res.data.errors){
                        this.e(res.data.errors[i][0])
                    }
				} else {
					this.swr()
				}
			}
		},
		async editAdmin(){
            if(this.editData.fullName.trim()=='') {
                return this.e('Full name is required')
            }
            if(this.editData.email.trim()=='') {
                return this.e('Email is required')
            }
			// if(this.editData.userType.trim()=='') {
            //     return this.e('User Type is required')
            // }
            if(!this.editData.role_id) {
                return this.e('Admin type  is required')
            }
			const res = await this.callApi('post', 'app/edit_user', this.editData)

			if(res.status===200){
				this.users[this.index] = this.editData
				this.s('Tag has been edited successfully!')
				this.editModal = false	
			}else{
				if(res.status==422){
                    for(let i in res.data.errors){
                        this.e(res.data.errors[i][0])
                    }					
				}else{
					this.swr()
				}				
			}
		},
		showEditModal(user, index){
			let obj = {
                id : user.id, 
				fullName : user.fullName, 
				email : user.email, 
				// userType : user.userType, 
				role_id : user.role_id, 
			}
			this.editData = obj
			this.editModal = true
			this.index = index
		},
		showDeletingModal(tag, i){
			const deleteModalObj  =  {
				showDeleteModal: true, 
				deleteUrl : 'app/delete_tag', 
				data : tag, 
				deletingIndex: i, 
				isDeleted : false,
			}
			this.$store.commit('setDeletingModalObj', deleteModalObj)
		} 
	},
	async created(){
		// const res = await this.callApi('get', 'app/get_users')
		// const resRole = await this.callApi('get', 'app/get_roles')
		const [res, resRole] = await Promise.all([
			this.callApi('get', 'app/get_users'), 
			this.callApi('get', 'app/get_roles')
		])

		if(res.status==200){
			this.users = res.data
		}else{
			this.swr()
		}
		if(resRole.status==200){
			this.roles = resRole.data
		}else{
			this.swr()
		}
	},
	components : {
		deleteModal
	}, 
	computed : {
		...mapGetters(['getDeleteModalObj'])
	},
	watch : {
		getDeleteModalObj(obj){
			if(obj.isDeleted){
				this.users.splice(obj.deletingIndex,1)
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>