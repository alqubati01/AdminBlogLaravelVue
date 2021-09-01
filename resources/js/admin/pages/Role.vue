<template>
    <div>
       <div class="content">
			<div class="container-fluid">
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Roles 
						<Button @click="addModal=true" v-if="isWritePermitted"><Icon type="md-add" />Add role</Button>
					</p>


					<div class="_overflow _table_div">
						<table class="_table">
							<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Role Type</th>
								<th>Created at</th>
								<th>Action</th>
							</tr>
							<!-- TABLE TITLE -->

							<!-- ITEMS -->
							<tr v-for="(role, i) in roles" :key="i" v-if="roles.length">
								<td>{{role.id}}</td>
								<td class="_table_name">{{role.roleName}}</td>
								<td>{{role.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(role, i)" v-if="isUpdatePermitted">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal(role, i)"  :loading="role.isDeleting" v-if="isDeletePermitted">Delete</Button>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<!-- role adding modal -->
				<Modal
					v-model="addModal"
					title="Add Role"
					:mask-closable="false"
					:closable="false">
					<Input v-model="data.roleName" placeholder="Add role name"  />
					<div slot="footer">
						<Button type="default" @click="addModal=false">Close</Button>
						<Button 
							type="primary" 
							@click="addRole" 
							:disabled="isAdding" 
							:loading="isAdding">
							{{isAdding ? 'Adding..' : 'Add role'}}
						</Button>
					</div>
				</Modal>

				<!-- role editing modal -->
				<Modal
					v-model="editModal"
					title="Edit role"
					:mask-closable="false"
					:closable="false"
					>
					<Input v-model="editData.roleName" placeholder="Edit role name"  />
					<div slot="footer">
						<Button type="default" @click="editModal=false">Close</Button>
						<Button 
							type="primary" 
							@click="editRole" 
							:disabled="isEditing" 
							:loading="isEditing">
							{{isEditing ? 'Editing..' : 'Edit role'}}
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
			roles: [], 
			data : {
				roleName: '' 
			},
			addModal: false, 
			isAdding: false,
			editModal : false, 
			editData : {
				roleName: ''
			},
			isEditing: false,
			index: -1, 
			showDeleteModal: false, 
			isDeleing : false,
			deleteItem: {}, 
			deletingIndex: -1,  
		}
	},
	methods: {
		async addRole() {
			if(this.data.roleName.trim()=='') {
				return this.e('Role name is required')
			}

			const res = await this.callApi('post', 'app/create_role', this.data)

			if(res.status===201) {
				this.roles.unshift(res.data)
				this.s('Role has been added successfully!')
				this.addModal = false
				this.data.roleName = ''
			} else {
				if(res.status==422){
					if(res.data.errors.roleName) {
						this.e(res.data.errors.roleName[0])
					}
				} else {
					this.swr()
				}
			}
		},
		async editRole(){
			if(this.editData.roleName.trim()=='') 
				return this.e('Role name is required')

			const res = await this.callApi('post', 'app/edit_role', this.editData)

			if(res.status===200){
				this.roles[this.index].roleName = this.editData.roleName
				this.s('Role has been edited successfully!')
				this.editModal = false	
			}else{
				if(res.status==422){
					if(res.data.errors.roleName){
						this.e(res.data.errors.roleName[0])
					}					
				}else{
					this.swr()
				}				
			}
		},
		showEditModal(role, index){
			let obj = {
				id : role.id, 
				roleName : role.roleName
			}
			this.editData = obj
			this.editModal = true
			this.index = index
		},
		showDeletingModal(role, i){
			const deleteModalObj  =  {
				showDeleteModal: true, 
				deleteUrl : 'app/delete_role', 
				data : role, 
				deletingIndex: i, 
				isDeleted : false,
			}
			this.$store.commit('setDeletingModalObj', deleteModalObj)
		} 
	},
	async created(){
		const res = await this.callApi('get', 'app/get_roles')
		if(res.status==200){
			this.roles = res.data
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
				this.tags.splice(obj.deletingIndex,1)
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>