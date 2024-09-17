import { IoCheckmark, IoCloseSharp } from 'react-icons/io5';

// eslint-disable-next-line react-refresh/only-export-components
export function getPasswordRequirements(password: string) {
    return {
        length: password.length >= 8 && password.length <= 200,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };
}

export function PasswordValidation({ password }: { password: string }) {
    const passwordReq = getPasswordRequirements(password);

    return (
        <>
            <div
                className={`${passwordReq.length ? 'text-green-600' : 'text-red-600'} flex flex-row gap-1 items-center`}>
                {passwordReq.length ? <IoCheckmark size={18}/> : <IoCloseSharp size={18}/>}
                Between 8 and 200 characters long
            </div>
            <div
                className={`${passwordReq.upper ? 'text-green-600' : 'text-red-600'} flex flex-row gap-1 items-center`}>
                {passwordReq.upper ? <IoCheckmark size={18}/> : <IoCloseSharp size={18}/>}
                Contains an uppercase letter
            </div>
            <div
                className={`${passwordReq.lower ? 'text-green-600' : 'text-red-600'} flex flex-row gap-1 items-center`}>
                {passwordReq.lower ? <IoCheckmark size={18}/> : <IoCloseSharp size={18}/>}
                Contains a lowercase letter
            </div>
            <div
                className={`${passwordReq.number ? 'text-green-600' : 'text-red-600'} flex flex-row gap-1 items-center`}>
                {passwordReq.number ? <IoCheckmark size={18}/> : <IoCloseSharp size={18}/>}
                Contains a number
            </div>
        </>
    );
}