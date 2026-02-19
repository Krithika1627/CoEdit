import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/cobalt.css';

function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);

    // 1️⃣ Initialize editor ONCE
    useEffect(() => {
        const editor = CodeMirror.fromTextArea(
            document.getElementById('realTimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: 'cobalt',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true
            }
        );

        editorRef.current = editor;
        editor.setSize('100%', '100%');

        editor.on('change', (instance, changeObj) => {
            const origin = changeObj.origin;
            const code = instance.getValue();
        
            if (onCodeChange) {
                onCodeChange(code);
            }
        
            // Only emit if user typed, not when setValue runs
            if (origin !== 'setValue' && socketRef.current) {
                socketRef.current.emit('user-typing', { roomId });
                socketRef.current.emit('code-change', { roomId, code });
            }
        });
        
        
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef.current && editorRef.current) {
    
                const handleCodeChange = ({ code }) => {
                    console.log("📥 Received:", code);
    
                    if (code != null) {
                        const currentCode = editorRef.current.getValue();
                        if (currentCode !== code) {
                            editorRef.current.setValue(code);
                        }
                    }
                };
    
                socketRef.current.on("code-change", handleCodeChange);
                socketRef.current.on("load-code", handleCodeChange);
    
                clearInterval(interval);
            }
        }, 100);
    
        return () => clearInterval(interval);
    }, []);
    
    

    return (
        <div className="editor-wrapper">
            <textarea id='realTimeEditor'></textarea>
        </div>
    )
}

export default Editor;
