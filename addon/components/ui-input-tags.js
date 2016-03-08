import Ember from 'ember';
import layout from '../templates/components/ui-input-tags';

export default Ember.Component.extend({
    layout: layout,
    /**
     * The root component element
     *
     * @property {Ember.String} tagName
     * @default  "div"
     */
    tagName: 'div',

    theme: 'fluid',
    /**
     * Class names to apply to the button
     *
     * @property {Ember.Array} classNames
     */
    classNameBindings: ['_uiClass', 'theme', '_componentClass'],
    _uiClass: 'ui',
    _componentClass: 'multiple search selection dropdown',

    renderDropDown: function() {
        let that = this;
        this.$().dropdown({
            allowAdditions: true,
            onAdd: function(addedValue, addedText, $addedChoice) {
                that._addValue(addedValue);
            },
            onRemove: function(removedValue, removedText, $removedChoice) {
                that._removeValue(removedValue);
            },
            onLabelCreate: function(label){
                that.$('input.search').val('');
                that.$('.addition.item b').html('');
                return $(label);
            }
        });
    },
    initialize: function(argument) {
        this.renderDropDown();
    }.on('didInsertElement'),
    _addValue(value){
        try{
            this.get('value').addObject(value);
        }catch(e){
            let id = Ember.guidFor(this);
            Ember.Logger.warn(`component:ui-input-tags ${id} value is not array`);
            Ember.Logger.error(e);
        }
        if(typeof this.attrs.update === 'function'){
            this.attrs.update(this.get('value'));
        }
    },
    _removeValue(value){
        this.get('value').removeObject(value);
        if(typeof this.attrs.update === 'function'){
            this.attrs.update(this.get('value'));
        }
    },
    didInitAttrs(){
        this._super(...arguments);
        //if value do not be passed to component
        if(this.attrs.value === undefined){
            this.set('value', Ember.A());
        }
    },
    hiddenValue: Ember.computed('value', {
        get(){
            if(Ember.isArray(this.value)){
                return this.value.join(',');
            }else{
                return '';
            }
        }
    })
});