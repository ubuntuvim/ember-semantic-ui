import Ember from 'ember';
import emberUploader from '../utils/ember-uploader';
import { fileObject, humanReadableFileSize } from '../utils/file-object';

const {get, set, computed} = Ember;

export default Ember.Component.extend({
    actions: {
        start: function(obj) {
            let url = this.get('url'),
                self = this;

            obj.uploader = emberUploader.create({
                url: url
            });

            obj.uploadPromise = obj.uploader.upload(obj.fileToUpload, this.params);

            self.sendAction('uploadStart', obj);
            obj.set('isUploading', computed.alias('uploader.isUploading'));

            obj.uploader.on('progress', function(e) {
                obj.set('percent', parseInt(e.percent));
                self.sendAction('uploadProgress', e);
            });

            obj.uploader.on('didUpload', function(data) {
                obj.set('isUploaded', true);
                obj.set('data', data);

                self.sendAction('uploadSuccess', obj);
            });
        },
        abort: function(obj) {
            this.sendAction('uploadAbort', obj);
            if (obj.uploader) {
                try {
                    obj.uploader.abort();
                } catch (e) {
                    
                }finally {
                    this.get('queue').removeObject(obj);
                }
            } else {
                this.get('queue').removeObject(obj);
            }
        },
        deleteFile: function(obj) {
            this.get('queue').removeObject(obj);
            this.sendAction('deleteFile', obj);
        }
    },
    /**
     * The upload url
     *
     * @property {Ember.String} url
     * @default  ""
     */
    url: '',

    /**
     * isClear
     *
     * @property {Ember.Boolean} isClear
     * @default  ""
     */
    isClear: false,

    /**
     * The root component element
     *
     * @property {Ember.String} tagName
     * @default  "div"
     */
    tagName: 'div',

    /**
     * A array contain class names apply to root element
     *
     * @property {Ember.Array} classNames
     * @default  ""
     */
    classNames: ['ui', 'segment'],

    /**
     * To  allow  file autoUpload
     *
     * @property {Ember.Boolean} forceIframeTransport
     * @default  false
     */
    autoUpload: true,

    /**
     * upload file queue
     *
     * @property {Ember.Array} queue
     * @default  []
     */
    queue: null,

    /**
     * upload multiple file
     *
     * @property {Ember.Boolean} multiple
     * @default  []
     */
    multiple: false,

    /**
     * extra params
     *
     * @property {Ember.Object} params
     * @default  null
     */
    params: null,

    /**
     * file accept
     *
     * @property {Ember.Object} accept
     * @default  null
     */
    accept: 'audio/*,video/*,image/*',

    /**
     * @function initialize
     * @observes "didInsertElement" event
     * @returns  {void}
     */
    initialize: function(argument) {
        let self = this;
        this.$('input').change(function(e) {
            let input = e.target,
                obj = null;
            if (!Ember.isEmpty(input.files)) {
                for (let i = input.files.length - 1; i >= 0; i--) {
                    let obj = fileObject.create({
                        fileToUpload: input.files[i]
                    });
                    self.queue.pushObject(obj);
                    if (self.autoUpload) {
                        self.send('start', obj);
                    }
                }

                //$(this).after($(this).clone().val(""));
                //empty input files
                $(this).val("");
            }
        });
    }.on('didInsertElement'),
    /**
     * @function willDestroy empty queue
     * 
     * @returns  null
     */
    willDestroy(){
        this._super();
        this.queue.clear();//clear input file
    },

    isClearChange: Ember.observer('isClear', function(){
        if(this.isClear){
            this.queue.clear();//clear input file
        }
    }),
    /**
     * @function willDestroy empty queue
     * 
     * @returns  null
     */
    init(){
        this._super(...arguments);
        this.set('queue', Ember.A());
    },
    /**
     * @function inputStyle
     * 
     * @returns  {string}
     */
    inputStyle: function() {
        let style_array = [
            'opacity: 0',
            'width:100% !important',
            'overflow:hidden',
            'position:relative',
            'left:-100%',
            'display:block',
        ]
        return style_array.join(';');
    }.property(),

    /**
     * @function labelStyle
     * 
     * @returns  {string}
     */
    labelStyle: function() {
        let style_array = [
            'height: 6.25em',
            'line-height: 5.25em',
            'text-align: center',
        ]
        return style_array.join(';');
    }.property(),
});