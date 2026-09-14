import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/navigation'
import { AuthHeader } from '@/components/authentication/AuthHeader'
import { RegistrationForm, type RegistrationValues } from '@/components/authentication/RegistrationForm'
import { PageTransition } from '@/components/motion/PageTransition'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const { startRegistration, registration } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (values: RegistrationValues) => {
    await startRegistration({ name: values.fullName, phone: values.phone })
    navigate(routes.verifyOtp)
  }

  return (
    <PageTransition>
      <AuthHeader step={1} title="Welcome to Thirukochi" subtitle="Your gold journey begins here." />
      <RegistrationForm
        defaultValues={registration ? { fullName: registration.name, phone: registration.phone } : undefined}
        onSubmit={onSubmit}
      />
    </PageTransition>
  )
}
