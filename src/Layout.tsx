import SideBar from './components/SideBar';
import SearchModal from './components/SearchModal';
import './styles/layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { currentUserAtom } from './modules/auth/current-user.state';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNoteStore } from './modules/notes/notes.state';
import { noteRepository } from './modules/notes/note.repository';
import type { Note } from './modules/notes/note.entity';

export default function Layout() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const noteStore = useNoteStore();
  const [isShowModal, setIsShowModal] = useState(false);
  const [serchResult, setSerchResult] = useState<Note[]>([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    const notes = await noteRepository.find();
    noteStore.set(notes);
    setIsLoading(false);
  };

  const serchNotes = async (keyword: string) => {
    const notes = await noteRepository.find({keyword});
    noteStore.set(notes);
    setSerchResult(notes ?? []);
  };

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  };

//既に登録できていない場合ログインに戻る
  if (!currentUser) return <Navigate to ="/signin" replace />;

  return (
    <div className='layout-container'>
      {!isLoading && <SideBar onSerchButtonClick={()=> setIsShowModal(true)}/>}
      <main className='layout-main'>
        <Outlet />
      </main>
      <SearchModal 
        isOpen={isShowModal} 
        onClose={()=> setIsShowModal(false)}
        notes={serchResult}
        onkeywordChange={serchNotes}
        onItemSelect={moveToDetail}
      />
    </div>
  );
}
