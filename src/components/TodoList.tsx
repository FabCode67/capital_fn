import React from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import { BsSun, BsCheck } from 'react-icons/bs'
const GET_TODOS = gql`
    query GetTodos {
        get {
            id
            description
            checked
        }
    }
`;

const TodoList: React.FC = () => {
    const { loading, error, data } = useQuery(GET_TODOS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log(data)
    

    return (
        <div className="c_one h-screen w-full bg-gray-500">
            <div className="c_two flex flex-col h-screen w-full  bg-slate-900">

                <div className="c_three h-[30%] w-full flex items-center justify-center bg-slate-500 p-10 bg-cover bg-center">
                    <div className="c_five m-auto flex flex-col  justify-between self-center h-[35rem] w-[35%]" style={{ zIndex: 1 }}>
                        <div className="c_six flex flex-col h-[18%] w-full ">
                            <div className="c_six flex h-[50%] w-full justify-between p-2">
                                <div className="">
                                    <h1 className='text-white'>TODO LIST</h1>
                                </div>
                                <div className="text-white">
                                    <BsSun />
                                </div>
                            </div>
                            <div className="c_six flex h-[50%] w-full bg-slate-900 p-3">
                                <div className='flex space-x-3'>
                                    <input type='radio' name='todo' value='todo' className='text-white h-[1rem] w-[1rem] mt-1' /> <span className='mt-[-1] text-white'>hello world</span>
                                </div>
                            </div>
                        </div>
                        <div className="c_six flex flex-col h-[79%] w-full bg-black">
                        {data.get.map((todo: any) => (

                            <div className="c_six flex w-full bg-slate-900 p-3 border-b-2 border-slate-400" key={todo.id}>

                                <div className='flex space-x-3'>
                                    <div className='bg-slate-700 w-[20px] h-[21px] rounded-full items-center flex justify-center'><div className={`w-[18px] h-[18px] rounded-full ${todo.checked ? 'bg-blue-500' : 'bg-slate-500'} m-auto flex justify-center items-center text-center`}>
  <button className='text-white'>{todo.checked ? <BsCheck /> : " " }</button>
</div>
</div>  <div className={`mt-[-1] text-white`}><p className={`${todo.checked ? 'line-through' : ''}`}>{todo.description}</p></div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="c_four h-[70%] w-full bg-slate-950 p-10 bg-cover bg-center">
                </div>
            </div>
        </div>

    )
}

export default TodoList