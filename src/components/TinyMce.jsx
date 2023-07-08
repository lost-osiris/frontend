import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

const TinyMce = ({ value, onChange, height }) => {
  const editorRef = useRef(null)

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <Editor
      apiKey='dtvbj54k907ax86riigixvtbjry1ve8he1ys3jkh3qemdu3o'
      init={{
        content_css: 'dark',
        height: height || 300,
        icons: 'material',
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        skin: 'oxide-dark',
        statusbar: false,
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          ' | media fullscreen |' +
          'removeformat | help',
      }}
      onEditorChange={(e) => handleChange(e)}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
    />
  )
}

export default TinyMce
