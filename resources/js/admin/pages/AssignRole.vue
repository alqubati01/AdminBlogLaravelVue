<template>
    <div>
       <div class="content">
			<div class="container-fluid">
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Roles 
						<Select v-model="data.id"  placeholder="Select admin type" style="width:300px" @on-change="changeAdmin">
                            <Option :value="role.id" v-for="(role, i) in roles" :key="i" v-if="roles.length">{{role.roleName}}</Option>
                        </Select>
					</p>


					<div class="_overflow _table_div">
						<table class="_table">
							<!-- TABLE TITLE -->
                            <tr>
                                <th>Resource name</th>
                                <th>Read</th>
                                <th>Write</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
							<!-- TABLE TITLE -->

							<!-- ITEMS -->
							<tr v-for="(resource, i) in resources" :key="i">
                                <td>{{resource.resourceName}}</td>
                                <td><Checkbox v-model="resource.read"></Checkbox></td>
                                <td><Checkbox v-model="resource.write"></Checkbox></td>
                                <td><Checkbox v-model="resource.update"></Checkbox></td>
                                <td><Checkbox v-model="resource.delete"></Checkbox></td>
                            </tr>
							<!-- ITEMS -->

                            <div class="center_button">
                                <Button type="primary" :loading="isSending" :disabled="isSending" @click="assignRoles">Assign</Button>
                            </div>
						</table>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
export default {
	data(){
		return {
			roles: [], 
			data : {
				id: null
			},
			isSending: false, 
            resources: [
                {resourceName: 'Home', read: false, write: false, update: false, delete: false, name: '/'},
                {resourceName: 'Tags', read: false, write: false, update: false, delete: false, name: 'tags'},
                {resourceName: 'Category', read: false, write: false, update: false, delete: false, name: 'categories'},
                {resourceName: 'Create blogs', read: false, write: false, update: false, delete: false, name: 'createBlog'},
                {resourceName: 'Blogs', read: false, write: false, update: false, delete: false, name: 'blogs'},
                {resourceName: 'Admin users', read: false, write: false, update: false, delete: false, name: 'adminusers'},
                {resourceName: 'Role', read: false, write: false, update: false, delete: false, name: 'role'},
                {resourceName: 'Assign Role', read: false, write: false, update: false, delete: false, name: 'assignRole'},
            ],
            defaultResourcesPermission: [
                {resourceName: 'Home', read: false, write: false, update: false, delete: false, name: '/'},
                {resourceName: 'Tags', read: false, write: false, update: false, delete: false, name: 'tags'},
                {resourceName: 'Category', read: false, write: false, update: false, delete: false, name: 'categories'},
                {resourceName: 'Create blogs', read: false, write: false, update: false, delete: false, name: 'createBlog'},
                {resourceName: 'Blogs', read: false, write: false, update: false, delete: false, name: 'blogs'},
                {resourceName: 'Admin users', read: false, write: false, update: false, delete: false, name: 'adminusers'},
                {resourceName: 'Role', read: false, write: false, update: false, delete: false, name: 'role'},
                {resourceName: 'Assign Role', read: false, write: false, update: false, delete: false, name: 'assignRole'},
            ],
		}
	},
	methods: {
        async assignRoles(){
            let data = JSON.stringify(this.resources)
            const res = await this.callApi('post','app/assign_roles', {'permission' : data, id: this.data.id})
            if(res.status==200){
                this.s('Role has been assigned successfully!')
                let index = this.roles.findIndex(role => role.id == this.data.id)
                this.roles[index].permission = data
            }else{
                this.swr()
            }
        },
        changeAdmin(){
            let index = this.roles.findIndex(role => role.id == this.data.id)
            let permission = this.roles[index].permission
            if(!permission){
                this.resources = this.defaultResourcesPermission
            }else{
                this.resources = JSON.parse(permission)
            }
        }
	},
	async created(){
		const res = await this.callApi('get', 'app/get_roles')
		if(res.status==200){
			this.roles = res.data
            if(res.data.length){
                this.data.id = res.data[0].id
                if(res.data[0].permission){
                    this.resources = JSON.parse(res.data[0].permission)
                    // this.resources = this.defaultResourcesPermission
                }
            }
		} else {
			this.swr()
		}
	}
}
</script>

<style lang="scss" scoped>

</style>