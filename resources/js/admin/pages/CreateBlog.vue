<template>
    <div>
       <div class="content">
			<div class="container-fluid">
                <div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Create blog</p>
                    <div class="_input_field">
                        <Input type="text" v-model="data.title" placeholder="Title" />
                    </div>
                    <div class="_overflow _table_div blog_editor">
						<editor
							ref="editor"
							autofocus
							holder-id="codex-editor"
							save-button-id="save-button"
							:init-data="initData"
							@save="onSave"
							:config="config"
						/>
					</div>
                    <div class="_input_field">
						 <Input type="textarea" v-model="data.post_excerpt" :rows="4" placeholder="Post excerpt " />
                    </div>
                    <div class="_input_field">
						<Select filterable multiple placeholder="Select category" v-model="data.category_id">
							<Option v-for="(category, i) in categories" :value="category.id" :key="i">{{ category.categoryName }}</Option>
						</Select>
					</div>
					<div class="_input_field">
						<Select filterable multiple placeholder="Select tag" v-model="data.tag_id">
							<Option v-for="(tag, i) in tags" :value="tag.id" :key="i">{{ tag.tagName }}</Option>
						</Select>
					</div>
					<div class="_input_field">
						 <Input type="textarea" v-model="data.metaDescription" :rows="4" placeholder="Meta description" />
                    </div>
                    <div class="_input_field">
                        <Button @click="save" :loading="isCreating" :disabled="isCreating">
                            {{isCreating ? 'Please wait...' : 'Create blog'}}
                        </Button>
					</div>
                </div>
			</div>
		</div>
    </div>
</template>

<script>
export default {
	data() {
		return {
			config : {
				tools : {
					checklist: require('@editorjs/checklist'),
					code: require('@editorjs/code'),
					delimiter: require('@editorjs/delimiter'),
					embed: require('@editorjs/embed'),
					header: require('@editorjs/header'),
					image: require('@editorjs/image'),
					inlineCode: require('@editorjs/inline-code'),
					link: require('@editorjs/link'),
					list: require('@editorjs/list'),
					marker: require('@editorjs/marker'),
					paragraph: require('@editorjs/paragraph'),
					personality: require('@editorjs/personality'),
					quote: require('@editorjs/quote'),
					raw: require('@editorjs/raw'),
					table: require('@editorjs/table'),
					warning: require('@editorjs/warning'),
				}
			},
			data: {
				title : '',
				post : '',
				post_excerpt : '',
				metaDescription : '',
				category_id : [],
				tag_id : [],
				jsonData : null
			},
			initData : null,
			articleHTML: '',
			categories : [],
			tags : [],
			isCreating : false,
		}
	},
	methods: {
		async onSave(response){
            // console.log('response on save', response)

			var data = response
			await this.outputHtml(data.blocks)
			this.data.post = this.articleHTML
            this.data.jsonData = JSON.stringify(data)

            if(this.data.post.trim()=='') { 
				return this.e('Post is required') 
			}
            if(this.data.title.trim()=='') { 
				return this.e('Title is required')
			}
            if(this.data.post_excerpt.trim()=='') { 
				return this.e('Post exerpt is required')
			}
            if(this.data.metaDescription.trim()=='') { 
				return this.e('Meta description is required')
			}
            if(!this.data.tag_id.length) { 
				return this.e('Tag is required')
			}
            if(!this.data.category_id.length) { 
				return this.e('Category is required')
			}

			this.isCreating = true
			const res = await this.callApi('post', 'app/create_blog', this.data)
			if(res.status===200){
				this.s('Blog has been created successfully!')
                // redirect...
                this.$router.push('/blogs')
			}else{
                if(res.status==422){
                    for(let i in res.data.errors){
                        this.e(res.data.errors[i][0])
                    }
                }else{
                    this.swr()
                }
			}
			this.isCreating = false
        },
		async save(){
			// const response = await this.$refs.editor.state.editor.save().then((response)=>response)
			// const response = await this.$refs.editor.state.editor.save()
    		// console.log('res is this: ', response)
    		// console.log('json stringify res is this: ', JSON.stringify(response))
			// let res = JSON.stringify(response)
    		// console.log('json parse res is this: ', JSON.parse(res))

			// console.log('resopnse save ', this.$refs.editor)
			this.$refs.editor._data.state.editor.save().then(this.onSave)
        },
		outputHtml(articleObj){
		   articleObj.map(obj => {
				switch (obj.type) {
					case 'paragraph':
						this.articleHTML += this.makeParagraph(obj);
						break;
					case 'image':
						this.articleHTML += this.makeImage(obj);
						break;
					case 'header':
						this.articleHTML += this.makeHeader(obj);
						break;
					case 'raw':
						this.articleHTML += `<div class="ce-block">
								<div class="ce-block__content">
									<div class="ce-code">
										<code>${obj.data.html}</code>
									</div>
								</div>
							</div>\n`;
						break;
					case 'code':
						this.articleHTML += this.makeCode(obj);
						break;
					case 'list':
						this.articleHTML += this.makeList(obj)
						break;
					case "quote":
						this.articleHTML += this.makeQuote(obj)
						break;
					case "warning":
						this.articleHTML += this.makeWarning(obj)
						break;
					case "checklist":
						this.articleHTML += this.makeChecklist(obj)
						break;
					case "embed":
						this.articleHTML += this.makeEmbed(obj)
						break;
					case 'delimeter':
						this.articleHTML += this.makeDelimeter(obj);
						break;
					default:
						return '';
				}
			});
		},
	},
	async created(){
		const [categories, tags] = await Promise.all([
			this.callApi('get', 'app/get_category'), 
			this.callApi('get', 'app/get_tags')
		])

		if(categories.status==200){
			this.categories = categories.data
		}else{
			this.swr()
		}
		if(tags.status==200){
			this.tags = tags.data
		}else{
			this.swr()
		}
	}
}
</script>

<style scoped>
	.blog_editor {
		width: 717px;
		margin-left: 160px;
		padding: 4px 7px;
		font-size: 14px;
		border: 1px solid #dcdee2;
		border-radius: 4px;
		color: #515a6e;
		background-color: #fff;
		background-image: none;
		z-index:  -1;
	}
	.blog_editor:hover {
		border: 1px solid #57a3f3;
	}
	._input_field{
		margin: 20px 0 20px 160px;
    	width: 717px;
	}
</style>