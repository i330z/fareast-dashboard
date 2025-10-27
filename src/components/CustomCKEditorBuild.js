import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Table } from '@ckeditor/ckeditor5-table';
import { TableToolbar } from '@ckeditor/ckeditor5-table';
import { Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageUpload } from '@ckeditor/ckeditor5-image';

class CustomEditor extends ClassicEditor {
    static builtinPlugins = [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Link,
        List,
        BlockQuote,
        Table,
        TableToolbar,
        Image,
        ImageToolbar,
        ImageCaption,
        ImageStyle,
        ImageResize,
        ImageUpload
    ];

    static defaultConfig = {
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                '|',
                'insertTable',
                'uploadImage',
                'undo',
                'redo'
            ]
        },
        image: {
            resizeOptions: [
                {
                    name: 'imageResize:original',
                    value: null,
                    label: 'Original'
                },
                {
                    name: 'imageResize:50',
                    value: '50',
                    label: '50%'
                },
                {
                    name: 'imageResize:75',
                    value: '75',
                    label: '75%'
                }
            ],
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageResize'
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    };
}

export default CustomEditor;