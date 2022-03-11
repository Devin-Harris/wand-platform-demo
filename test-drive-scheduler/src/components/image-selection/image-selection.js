import ImageComponent from '@/components/image-component'

export default {
  name: 'image-selection',
  components: {
    ImageComponent
  },
  props: {
    selectedImages: [],
    images: [],
  },
  data() {
    return {
    }
  },
  methods: {
    imageIsSelected(image) {
      return this.selectedImages.some(img => img._id === image._id)
    },
    toggleImageSelection(image) {
      this.$emit('toggle-image', image)
    },
  }
}