import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { BsSun, BsCheck } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

const GET_TODOS = gql`
  query GetTodos {
    get {
      id
      description
      checked
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($description: String!) {
    post(description: $description) {
      id
      description
      checked
    }
  }
`;

const UPDATE_IS_CHECKED = gql`
    mutation UpdateIsChecked($id: Int!, $checked: Boolean!) {
        updateChecked(id: $id, checked: $checked) {
            id
            description
            checked
        }
    }
`;

const CLEAR_COMPLETED = gql`
  mutation ClearCompleted {
    clearCompleted
  }
`;

const DELETE_TODO = gql`
    mutation DeleteTodo ($id: Int!) {
        delete(id: $id) {
            id
            description
            checked
        }
    }
`;

const TodoList: React.FC = () => {
    const { loading, error, data } = useQuery(GET_TODOS);
    const [addTodo] = useMutation(ADD_TODO);
    const [updateIsChecked] = useMutation(UPDATE_IS_CHECKED);
    const [deleteTodo] = useMutation(DELETE_TODO);
    const [clearCompleted] = useMutation(CLEAR_COMPLETED);
    const [newTodo, setNewTodo] = useState('');

    const [filter, setFilter] = useState('all');
    const [sortedTodos, setSortedTodos] = useState([]);

    useEffect(() => {
        setSortedTodos(data?.get);
    }, [data?.get]);

    useEffect(() => {
        filterTodos();
    }, [filter]);

    const filterTodos = () => {
        if (filter === 'all') {
            setSortedTodos(data?.get);
        } else if (filter === 'active') {
            const activeTodos = data?.get.filter((todo: any) => !todo.checked);
            setSortedTodos(activeTodos);
        } else if (filter === 'completed') {
            const completedTodos = data?.get.filter((todo: any) => todo.checked);
            setSortedTodos(completedTodos);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addTodo({
                variables: {
                    description: newTodo,
                },
                refetchQueries: [{ query: GET_TODOS }],
            });
            setNewTodo('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateIsChecked = async (id: string, checked: boolean) => {

        try {
            await updateIsChecked({
                variables: {
                    id,
                    checked: !checked,
                },
            });

        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTodo = async (id: string): Promise<void> => {
        try {
            await deleteTodo({
                variables: {
                    id,
                },
                refetchQueries: [{ query: GET_TODOS }],
            });
        } catch (err) {
            console.error(err);
        }
    };
 
    const handleClearCompleted = async (): Promise<void> => {
        try {
          await clearCompleted({
            refetchQueries: [{ query: GET_TODOS }],
          });
        } catch (err) {
          console.error(err);
        }
      };

    const handleFilterAll = () => {
        setFilter('all');
        setSortedTodos(data?.get);
    };

    const handleFilterActive = () => {
        setFilter('active');
        const activeTodos = data.get.filter((todo: any) => !todo.checked);
        setSortedTodos(activeTodos);
    };

    const handleFilterCompleted = () => {
        setFilter('completed');
        const completedTodos = data.get.filter((todo: any) => todo.checked);
        setSortedTodos(completedTodos);
    };



    return (
        <div className="c_one h-screen w-full bg-gray-500">
            <div className="c_two flex flex-col h-screen w-full  ">
                <div className="c_three h-[30%] w-full flex items-center justify-center bg-slate-500 p-10 bg-cover bg-center">
                    <div className="c_five m-auto flex flex-col  justify-between self-center h-[35rem] w-[35%] md:w-[50rem]" style={{ zIndex: 1 }}>
                        <div className="c_six flex flex-col h-[18%] w-full ">
                            <div className="c_six flex h-[50%] w-full justify-between p-2">
                                <div className="">
                                    <h1 className="text-white">TODO LIST</h1>
                                </div>
                                <div className="text-white">
                                    <BsSun />
                                </div>
                            </div>
                            <div className="c_six flex  w-full p-3 bg-slate-900 ">
                                <form className="flex w-full" onSubmit={handleAddTodo}>
                                    <div className="flex space-x-3 w-full">
                                        <div className="add_todo bg-slate-700 w-[20px] h-[21px] rounded-full items-center flex justify-center">
                                            <div className={`w-[18px] h-[18px] rounded-full todo.checked  hover:bg-blue-500 m-auto flex justify-center items-center text-center`}>
                                                <button type="submit" className="text-white">
                                                    <BsCheck />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`mt-[-1] text-white w-full border border-1 rounded-sm  border-slate-400`}>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-900 text-white px-2"
                                                placeholder="Add a new task"
                                                value={newTodo}
                                                onChange={(e) => setNewTodo(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="c_six flex flex-col h-[79%] w-full">
                            {sortedTodos?.map((todo: any) => (
                                <div className="c_six flex justify-between w-full bg-slate-900 p-3 border-b-2 border-slate-400" key={todo.id}>
                                    <div className="flex space-x-3">
                                        <button className="text-white cursor-pointer" onClick={() => handleUpdateIsChecked(todo.id, todo.checked)}>
                                            <div className="bg-slate-700 w-[20px] h-[21px] rounded-full items-center flex justify-center">
                                                <div className={`w-[18px] h-[18px] rounded-full ${todo.checked ? 'bg-blue-500' : 'bg-slate-500'} m-auto flex justify-center items-center text-center`}>
                                                    {todo.checked ? <BsCheck /> : ''}
                                                </div>
                                            </div>
                                        </button>
                                        <div className={`mt-[-1] text-white`}>
                                            <p className={`${todo.checked ? 'line-through' : ''}`}>{todo.description}</p>
                                        </div>
                                    </div>
                                    {todo.checked &&
                                        <div className='delete_button'>
                                            <button className="cursor-pointer text-red-500" onClick={() => handleDeleteTodo(todo.id)}><FaTrash /></button>
                                        </div>
                                    }
                                </div>
                            ))}

                            <div className='footer flex md:flex-col justify-between w-full bg-slate-900 p-3 border-b-2 border-slate-400'>
                                <button className="text-white cursor-pointer">{sortedTodos?.length == 0 ? 'Empty' : sortedTodos?.length <= 1 ? sortedTodos?.length + ' Item' :sortedTodos?.length + ' Itmes'}</button>
                                <div className="flex space-x-3">
                                <button className={`${filter == 'all' ? 'text-blue-500': 'text-white'} cursor-pointer`} onClick={handleFilterAll}>
                                    All
                                </button>
                                <button className={`${filter == 'active' ? 'text-blue-500': 'text-white'} cursor-pointer`} onClick={handleFilterActive}>
                                    Active
                                </button>
                                <button className={`${filter == 'completed' ? 'text-blue-500': 'text-white'} cursor-pointer`} onClick={handleFilterCompleted}>
                                    Completed
                                </button>
                                </div>
                                <button className="text-white cursor-pointer" onClick={handleClearCompleted}>Clear Completed</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="c_four h-[70%] w-full bg-slate-950 p-10 bg-cover bg-center"></div>
            </div>
        </div>
    );
};

export default TodoList;
