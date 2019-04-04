import moment from 'moment'

var utilitiesMixin = {
  methods: {
    getTimeFromInteger(time) {
      if (!time)
        return null
      var min = (time).toString().slice(-2)
      var hour = (time).toString().substring(0, (time).toString().length - 2)
      if (min && hour)
        return moment({
          hour: hour,
          minute: min
        }).format('HH:mm')
      return null
    }
  }
}

export default utilitiesMixin