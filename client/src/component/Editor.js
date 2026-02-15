import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/cobalt.css';

function Editor({socketRef, roomId, onCodeChange}) {
    const editorRef=useRef(null);

    useEffect(()=>{
        const init=async()=>{
            const editor=CodeMirror.fromTextArea(
                document.getElementById('realTimeEditor'),
                {
                    mode:{name:'javascript',json:true},
                    theme:'cobalt',
                    autoCloseTags:true,
                    autoCloseBrackets:true,
                    lineNumbers:true
                }
            );
            editorRef.current=editor;
            editor.setSize('100%','100%');

            editor.on('change',(instance,changes)=>{
                //console.log(`changes`,instance,changes);
                const {origin}=changes;
                const code=instance.getValue();
                onCodeChange(code);

                if(origin!=='setValue'){
                    socketRef.current.emit('user-typing',{
                        roomId,
                    });
                    
                    socketRef.current.emit('code-change',{
                        roomId,
                        code, 
                    });
                }
            });
        };
        init();
    },[]);

    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=>{
                if(code!=null){
                    editorRef.current.setValue(code);
                }
            });
        }
        return()=>{
            socketRef.current.off('code-change');
        };
    },[socketRef.current])
  return (
    <div className="editor-wrapper">
        <textarea id='realTimeEditor'></textarea>
    </div>
  )
}

export default Editor