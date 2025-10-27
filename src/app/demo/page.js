"use client"
import React from 'react'
import TextEditor  from "@/components/CkEditor"


function page() {
    const [editorData, setEditorData] = React.useState("<p>Hello from CKEditor 5!</p>");

  return (
    <div>
        <TextEditor value="<p>Hello from CKEditor 5!</p>" onChange={(data) => setEditorData(data)} />
        <div className="mt-5 p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">Editor Data:</h2>
            <div dangerouslySetInnerHTML={{ __html: editorData }} />
        </div>  
    </div>
  )
}

export default page