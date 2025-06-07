package com.autocare.autocare1.ui.auth

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.autocare.autocare1.ui.components.*

@Composable
fun AuthScreen(
    onAuthSuccess: (String) -> Unit,
    viewModel: AuthViewModel = hiltViewModel()
) {
    var isLogin by remember { mutableStateOf(true) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is AuthState.Success) {
            onAuthSuccess((authState as AuthState.Success).token)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = if (isLogin) "Login" else "Register",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        when (authState) {
            is AuthState.Loading -> LoadingSpinner()
            is AuthState.Error -> ErrorMessage((authState as AuthState.Error).message)
            else -> {
                AutoCareTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = "Email",
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                AutoCareTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = "Password",
                    isPassword = true,
                    modifier = Modifier.padding(bottom = 24.dp)
                )

                AutoCareButton(
                    onClick = {
                        if (isLogin) {
                            viewModel.login(email, password)
                        } else {
                            viewModel.register(email, password)
                        }
                    },
                    text = if (isLogin) "Login" else "Register",
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                TextButton(
                    onClick = { isLogin = !isLogin }
                ) {
                    Text(
                        text = if (isLogin) "Need an account? Register" else "Have an account? Login"
                    )
                }
            }
        }
    }
} 