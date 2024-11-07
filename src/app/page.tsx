'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Moon, Sun } from 'lucide-react';

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

  // 添加主题状态
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 加载保存的笔记和主题
  useEffect(() => {
    const savedNotes = localStorage.getItem('cornellNotes');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 切换主题的函数
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    <div className="container mx-auto mt-4 p-6 max-w-6xl bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 笔记列表 */}
        <div className="md:col-span-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[700px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">已保存的笔记</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">暂无笔记</p>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className="bg-white dark:bg-gray-700 p-3 mb-2 rounded-md shadow-sm flex justify-between items-center"
              >
                <div 
                  onClick={() => handleLoadNote(note)} 
                  className="cursor-pointer flex-grow"
                >
                  <h3 className="font-medium dark:text-white">{note.title || '无标题笔记'}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                className="mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              />
              
              <div className="grid grid-rows-2 gap-4 h-[500px]">
                <Textarea 
                  placeholder="主要笔记区域" 
                  value={currentNote.mainNotes || ''}
                  onChange={(e) => setCurrentNote(prev => ({...prev, mainNotes: e.target.value}))}
                  className="resize-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                />
                
                <Textarea 
                  placeholder="提示栏/关键词" 
                  value={currentNote.cueColumn || ''}
                  onChange={(e) => setCurrentNote(prev => ({...prev, cueColumn: e.target.value}))}
                  className="resize-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <Textarea 
                placeholder="总结区域" 
                value={currentNote.summaryNotes || ''}
                onChange={(e) => setCurrentNote(prev => ({...prev, summaryNotes: e.target.value}))}
                className="h-[calc(100%)] resize-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={handleSaveNote}>保存笔记</Button>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
