import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { format } from 'date-fns'

import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react'

import { Input } from '../Input'

const setSchedule = async ({ date, ...data }) => axios({
    method: 'post',
    url: '/api/schedule',
    data: {
        ...data,
        date: format(date, 'yyyy-MM-dd'),
        username: window.location.pathname.replace('/', ''),
    },
})

const ModalTimeBlock = ({ isOpen, onClose, onComplete, isSubmitting, children }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Faça sua reserva</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>

            <ModalFooter>
                {!isSubmitting && <Button variant="ghost" onClick={onClose}>Cancelar</Button>}
                <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>
                    Reservar horário
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
)


export const TimeBlock = ({ time, date, disabled, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(prevState => !prevState)

    const { values, handleSubmit, handleChange, handleBlur, errors, touched, isSubmitting } = useFormik({
        onSubmit: async (values) => {
            try {
                await setSchedule({ ...values, time, date })
                toggle()
                onSuccess()
            } catch (error) {
                console.log(error)
            }
        },
        initialValues: {
            name: '',
            email: ''
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Preenchimento obrigatório'),
            phone: yup.string().required('Preenchimento obrigatório')
        })
    })

    return (
        <Button p={8} bg="blue.500" color="white" onClick={toggle} disabled={disabled}>
            {time}
            {!disabled && <ModalTimeBlock
                isOpen={isOpen}
                onClose={toggle}
                onComplete={handleSubmit}
                isSubmitting={isSubmitting}
            >
                <>
                    <Input
                        label="Nome:"
                        name="name"
                        touched={touched.name}
                        error={errors.name}
                        value={values.name}
                        placeholder="Digite seu nome" o
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="lg"
                        disabled={isSubmitting}
                    />

                    <Input
                        label="Telefone"
                        name="phone"
                        mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                        error={errors.phone}
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="(99) 9 9999-9999"
                        size="lg"
                        mt={4}
                        disabled={isSubmitting}
                    />
                </>
            </ModalTimeBlock>}
        </Button>
    )
}
