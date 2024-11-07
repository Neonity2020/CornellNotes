'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // 建议添加toast通知

// 定义笔记接口
interface Note {
  id: string;
  title: string;
  mainNotes: string;
  cueColumn: string;
  summaryNotes: string;
  createdAt: number;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    mainNotes: '',
    cueColumn: '',
    summaryNotes: ''
  });

  // 加载保存的笔记
  useEffect(() => {
    const savedNotes = localStorage.getItem('cornellNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // 保存笔记到LocalStorage
  const handleSaveNote = () => {
    // 如果没有输入内容，不保存
    if (!currentNote.title && !currentNote.mainNotes) {
      toast.error('请至少输入标题或主要笔记');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(), // 使用时间戳作为唯一ID
      ...currentNote,
      createdAt: Date.now()
    } as Note;

    // 更新笔记列表
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);

    // 保存到LocalStorage
    localStorage.setItem('cornellNotes', JSON.stringify(updatedNotes));

    // 清空当前笔记
    setCurrentNote({
      title: '',
      mainNotes: '',
      cueColumn: '',
      summaryNotes: ''
    });

    toast.success('笔记保存成功');
  };

  // 加载已保存的笔记
  const handleLoadNote = (note: Note) => {
    setCurrentNote({
      title: note.title,
      mainNotes: note.mainNotes,
      cueColumn: note.cueColumn,
      summaryNotes: note.summaryNotes
    });
  };

  // 删除笔记
  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('cornellNotes', JSON.stringify(updatedNotes));
    toast.success('笔记已删除');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 笔记列表 */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg max-h-[700px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">已保存的笔记</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500">暂无笔记</p>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className="bg-white p-3 mb-2 rounded-md shadow-sm flex justify-between items-center"
              >
                <div 
                  onClick={() => handleLoadNote(note)} 
                  className="cursor-pointer flex-grow"
                >
                  <h3 className="font-medium">{note.title || '无标题笔记'}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteNote(note.id)}
                >
                  删除
                </Button>
              </div>
            ))
          )}
        </div>

        {/* 笔记编辑区 */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-center">康奈尔笔记</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                placeholder="笔记标题" 
                value={currentNote.title || ''}
                onChange={(e) => setCurrentNote(prev => ({...prev, title: e.target.value}))}
                className="mb-4"
              />
              
              <div className="grid grid-rows-2 gap-4 h-[500px]">
                <Textarea 
                  placeholder="主要笔记区域" 
                  value={currentNote.mainNotes || ''}
                  onChange={(e) => setCurrentNote(prev => ({...prev, mainNotes: e.target.value}))}
                  className="resize-none"
                />
                
                <Textarea 
                  placeholder="提示栏/关键词" 
                  value={currentNote.cueColumn || ''}
                  onChange={(e) => setCurrentNote(prev => ({...prev, cueColumn: e.target.value}))}
                  className="resize-none"
                />
              </div>
            </div>
            
            <div>
              <Textarea 
                placeholder="总结区域" 
                value={currentNote.summaryNotes || ''}
                onChange={(e) => setCurrentNote(prev => ({...prev, summaryNotes: e.target.value}))}
                className="h-[calc(100%)] resize-none"
              />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={handleSaveNote}>保存笔记</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
