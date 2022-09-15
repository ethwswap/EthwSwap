export default defineComponent({
  name: 'WHeader',
  props: {
  },
  setup(props, { emit, attrs, slots }) {
    let btnClass = 'p-4'
    return () => {
      return (
        <div class={[btnClass]}>
          {slots?.default()}
        </div>
      )
    }
  }
})
