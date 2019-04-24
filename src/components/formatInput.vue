<template>
  <el-input :placeholder="placeholder" @blur="onBlurHandler" @change="onInputHandler" @focus="onFocusHandler" ref="numeric" type="tel" v-model="amount" clearable v-if="!readOnly"/>
  <el-input v-else ref="readOnly" :placeholder="placeholder" type="tel" v-model="amount" :disabled="readOnly"/>
  <!--<format-input currency="¥" separator="," :precision="2" v-model="formData.estimatedAmount" :max="10000000" :min="-10000000" class="w300" empty-value="-" :minus="true"/>-->
  <!--<p>precision-小数点位数</p>-->
  <!--<p>currency-自定义符号</p>-->
  <!--<p>separator-分隔符</p>-->
  <!--<p>emptyValue-值为空或0时自定义显示内容</p>-->
  <!--<p>read-only="true"-只显示文本</p>-->
  <!--<p>max-最大值</p>-->
  <!--<p>min-最小值</p>-->
  <!--<p>minus-boolean-是否启动负数和最小值</p>-->
</template>

<script>
import accounting from 'accounting-js'
export default {
  name: 'FormatInput',
  props: {
    /**
     * Currency symbol.
     */
    currency: {
      type: String,
      default: '',
      required: false
    },
    /**
     * Maximum value allowed.
     */
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER || 9007199254740991,
      required: false
    },
    /**
     * Minimum value allowed.
     */
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER || -9007199254740991,
      required: false
    },
    /**
     * Enable/Disable minus value.
     */
    minus: {
      type: Boolean,
      default: false,
      required: false
    },
    /**
     * Input placeholder.
     */
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    /**
     * Value when the input is empty
     */
    emptyValue: {
      type: [Number, String],
      default: '',
      required: false
    },
    /**
     * Number of decimals.
     * Decimals symbol are the opposite of separator symbol.
     */
    precision: {
      type: Number,
      default: 0,
      required: false
    },
    /**
     * Thousand separator type.
     * Separator props accept either . or , (default).
     */
    separator: {
      type: String,
      default: ',',
      required: false
    },
    /**
     * Forced thousand separator.
     * Accepts any string.
     */
    thousandSeparator: {
      default: undefined,
      required: false,
      type: String
    },
    /**
     * Forced decimal separator.
     * Accepts any string.
     */
    decimalSeparator: {
      default: undefined,
      required: false,
      type: String
    },
    /**
     * The output type used for v-model.
     * It can either be String or Number (default).
     */
    outputType: {
      required: false,
      type: String,
      default: 'Number'
    },
    /**
     * v-model value.
     */
    value: {
      type: [Number, String],
      default: '',
      required: true
    },
    /**
     * Hide input and show value in text only.
     */
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    /**
     * Class for the span tag when readOnly props is true.
     */
    readOnlyClass: {
      type: String,
      default: '',
      required: false
    },
    /**
     * Position of currency symbol
     * Symbol position props accept either 'suffix' or 'prefix' (default).
     */
    currencySymbolPosition: {
      type: String,
      default: 'prefix',
      required: false
    }
  },
  data: () => ({
    amount: '',
    isFocus: false
  }),
  computed: {
    /**
     * Number type of formatted value.
     * @return {Number}
     */
    amountNumber() {
      return this.unformat(this.amount)
    },
    /**
     * Number type of value props.
     * @return {Number}
     */
    valueNumber() {
      return this.unformat(this.value)
    },
    /**
     * Define decimal separator based on separator props.
     * @return {String} '.' or ','
     */
    decimalSeparatorSymbol() {
      if (typeof this.decimalSeparator !== 'undefined') {
        return this.decimalSeparator
      }
      if (this.separator === ',') return '.'
      return ','
    },
    /**
     * Define thousand separator based on separator props.
     * @return {String} '.' or ','
     */
    thousandSeparatorSymbol() {
      if (typeof this.thousandSeparator !== 'undefined') {
        return this.thousandSeparator
      }
      if (this.separator === '.') return '.'
      if (this.separator === 'space') return ' '
      return ','
    },
    /**
     * Define format position for currency symbol and value.
     * @return {String} format
     */
    symbolPosition() {
      if (!this.currency) return '%v'
      return this.currencySymbolPosition === 'suffix' ? '%v %s' : '%s %v'
    }
  },
  watch: {
    /**
     * Watch for value change from other input with same v-model.
     * @param {Number} newValue
     */
    valueNumber(newValue) {
      if (this.$refs.numeric !== document.activeElement) {
        if (typeof parseInt(newValue) === 'number' && newValue !== 0) {
          this.amount = this.format(newValue)
        } else {
          this.isFocus
            ? (this.amount = this.format(newValue))
            : (this.amount = this.emptyValue)
        }
      }
    },
    /**
     * When readOnly is true, replace the span tag class.
     * @param {Boolean} newValue
     * @param {Boolean} oldValue
     */
    readOnly(newValue, oldValue) {
      if (oldValue === false && newValue === true) {
        this.$nextTick(() => {
          this.$refs.readOnly.className = this.readOnlyClass
        })
      }
    },
    /**
     * Immediately reflect separator changes
     */
    separator() {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
    },
    /**
     * Immediately reflect currency changes
     */
    currency() {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
    },
    /**
     * Immediately reflect precision changes
     */
    precision() {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
    }
  },
  mounted() {
    // Set default value props when placeholder undefined.
    if (!this.placeholder) {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
      // In case of delayed props value.
      setTimeout(() => {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      }, 500)
    }
    // Set read-only span element's class
    if (this.readOnly) this.$refs.readOnly.className = this.readOnlyClass
  },
  methods: {
    /**
     * Handle blur event.
     * @param {Object} e
     */
    onBlurHandler(e) {
      this.isFocus = false
      this.$emit('blur', e)
      if (this.valueNumber && this.valueNumber !== null) {
        this.amount = this.format(this.valueNumber)
      } else {
        this.amount = this.emptyValue
      }
    },
    /**
     * Handle focus event.
     * @param {Object}
     */
    onFocusHandler(e) {
      this.isFocus = true
      this.$emit('focus', e)
      if (this.valueNumber === 0) {
        this.amount = null
      } else {
        this.amount = accounting.formatMoney(this.valueNumber, {
          symbol: '',
          format: '%v',
          thousand: '',
          decimal: this.decimalSeparatorSymbol,
          precision: Number(this.precision)
        })
      }
    },
    /**
     * Handle input event.
     */
    onInputHandler() {
      this.process(this.amountNumber)
    },
    /**
     * Validate value before update the component. ok
     * @param {Number} value
     */
    process(value) {
      if (value >= this.max) this.update(this.max)
      if (value <= this.min) this.update(this.min)
      if (value > this.min && value < this.max) this.update(value)
      if (!this.minus && value < 0) {
        this.min >= 0 ? this.update(this.min) : this.update(0)
      }
    },
    /**
     * Update parent component model value.
     * @param {Number} value
     */
    update(value) {
      if (
        (typeof parseInt(value) === 'number' && value !== 0) ||
        value === ''
      ) {
        const fixedValue = accounting.toFixed(value, this.precision)
        const output =
          this.outputType.toLowerCase() === 'string'
            ? fixedValue
            : Number(fixedValue)
        this.$emit('input', output)
      } else {
        this.$emit('input', value)
      }
    },
    /**
     * Format value using symbol and separator.
     * @param {Number} value
     * @return {String}
     */
    format(value) {
      if (value !== 0) {
        return accounting.formatMoney(value, {
          symbol: this.currency,
          format: this.symbolPosition,
          precision: Number(this.precision),
          decimal: this.decimalSeparatorSymbol,
          thousand: this.thousandSeparatorSymbol
        })
      } else if (!this.isFocus) {
        return this.emptyValue
      }
    },
    /**
     * Remove symbol and separator.
     * @param {Number} value
     * @return {Number}
     */
    unformat(value) {
      const toUnformat =
        typeof value === 'string' && value === '' ? this.emptyValue : value
      return accounting.unformat(toUnformat, this.decimalSeparatorSymbol)
    }
  }
}
</script>